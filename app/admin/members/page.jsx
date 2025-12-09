'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, query, where, getDocs, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AdminMembersPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'elites');
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [blockFilter, setBlockFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  
  // Helper function for ordinal suffix
  const getOrdinalSuffix = (num) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return num + "st";
    if (j === 2 && k !== 12) return num + "nd";
    if (j === 3 && k !== 13) return num + "rd";
    return num + "th";
  };
  
  const tabs = [
    { 
      id: 'elites', 
      name: 'ELITES Members', 
      fullName: 'Excellence in Information Technology Education Society',
      program: 'BSIT', 
      color: 'blue',
      bgColor: 'bg-blue-600'
    },
    { 
      id: 'specs', 
      name: 'SPECS Members', 
      fullName: 'Society of Programming and Engineering for Computer Science',
      program: 'BSCS', 
      color: 'green',
      bgColor: 'bg-green-600'
    },
    { 
      id: 'images', 
      name: 'IMAGES Members', 
      fullName: 'Interactive Media and Game Education Society',
      program: 'BSEMC', 
      color: 'purple',
      bgColor: 'bg-purple-600'
    },
    { 
      id: 'council', 
      name: 'Council Members', 
      fullName: 'Computer and Communication Sciences Council',
      program: 'all', 
      color: 'orange',
      bgColor: 'bg-orange-600'
    },
  ];

  useEffect(() => {
    if (!activeTab) {
      setMembers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const currentTab = tabs.find(t => t.id === activeTab);
    
    // First, try to fetch from members collection with real-time listener
    let membersQuery;
    if (activeTab === 'council') {
      membersQuery = query(
        collection(db, 'members'),
        where('organizationId', '==', 'student_council')
      );
    } else {
      membersQuery = query(
        collection(db, 'members'),
        where('organizationId', '==', activeTab)
      );
    }

    // Real-time listener for members - updates automatically when students pay
    const unsubscribe = onSnapshot(
      membersQuery,
      async (snapshot) => {
        if (!snapshot.empty) {
          const membersData = [];
          const processedUserIds = new Set();
          
          // First, add all members from members collection
          for (const doc of snapshot.docs) {
            const data = doc.data();
            
            // Verify user exists in users collection and is not an admin
            if (data.userId) {
              try {
                const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', data.userId)));
                if (!userDoc.empty) {
                  const userData = userDoc.docs[0].data();
                  // Only include registered students (exclude admins)
                  if (userData.isAdmin) {
                    continue;
                  }
                  
                  processedUserIds.add(data.userId);
                  
                  membersData.push({
                    id: data.userId,
                    ...userData,
                    ...data,
                    subscriptionStatus: data.status || 'active',
                    subscriptionType: data.paymentPlan || 'N/A',
                    paymentPlan: data.paymentPlan,
                    semesterType: data.semesterType,
                    semesterLabel: data.semesterLabel,
                    joinedDate: data.joinedAt?.toDate() || data.createdAt?.toDate() || null,
                  });
                } else {
                  // User doesn't exist in users collection, skip
                  continue;
                }
              } catch (err) {
                console.error('Error verifying user:', err);
                // Continue anyway if verification fails
              }
            }
          }
          
          // Then, add ALL registered students from users collection who haven't been added yet
          const currentTab = tabs.find(t => t.id === activeTab);
          if (currentTab && currentTab.program !== 'all') {
            const usersQuery = query(
              collection(db, 'users'),
              where('program', '==', currentTab.program)
            );
            const usersSnapshot = await getDocs(usersQuery);
            
            for (const doc of usersSnapshot.docs) {
              const userData = doc.data();
              
              // Skip admins and already processed users
              if (userData.isAdmin || processedUserIds.has(userData.uid)) {
                continue;
              }
              
              // Check subscription status
              const subscriptionsQuery = query(
                collection(db, 'subscriptions'),
                where('userId', '==', userData.uid),
                where('type', '==', 'organization'),
                where('organizationId', '==', activeTab)
              );
              const subscriptionsSnapshot = await getDocs(subscriptionsQuery);
              
              let isActive = false;
              let subscription = null;
              const now = new Date();
              
              for (const subDoc of subscriptionsSnapshot.docs) {
                const subData = subDoc.data();
                if (subData.status === 'active') {
                  const endDate = subData.endDate?.toDate?.() || subData.endDate;
                  if (!endDate || new Date(endDate) >= now) {
                    isActive = true;
                    subscription = subData;
                    break;
                  }
                }
              }
              
              membersData.push({
                id: userData.uid,
                ...userData,
                subscriptionStatus: isActive ? 'active' : 'inactive',
                subscriptionType: subscription?.paymentType || 'N/A',
                paymentPlan: subscription?.paymentPlan,
                joinedDate: subscription?.createdAt?.toDate() || userData.createdAt?.toDate(),
              });
            }
          }
          
          setMembers(membersData);
          setLoading(false);
        } else {
          // If members collection is empty, fallback to subscriptions
          fetchMembersFallback();
        }
      },
      async (error) => {
        console.error('Error in real-time members listener:', error);
        // Fallback to subscriptions on error
        await fetchMembersFallback();
      }
    );

    // Fallback function to fetch ALL registered students (not just those who paid)
    const fetchMembersFallback = async () => {
      try {
        if (activeTab === 'council') {
          // For council, show all registered students (any program) with council subscription status
          const allUsersSnapshot = await getDocs(collection(db, 'users'));
          const councilSubscriptionsQuery = query(
            collection(db, 'subscriptions'),
            where('type', '==', 'council')
          );
          const subscriptionsSnapshot = await getDocs(councilSubscriptionsQuery);
          
          const membersData = [];
          const now = new Date();
          
          for (const doc of allUsersSnapshot.docs) {
            const userData = doc.data();
            if (userData.isAdmin) continue;
            
            // Check for active council subscription
            const subscription = subscriptionsSnapshot.docs
              .find(subDoc => subDoc.data().userId === userData.uid)?.data();
            
            let isActive = false;
            if (subscription?.status === 'active') {
              const endDate = subscription.endDate?.toDate?.() || subscription.endDate;
              if (!endDate || new Date(endDate) >= now) {
                isActive = true;
              }
            }
            
            membersData.push({
              id: userData.uid,
              ...userData,
              subscriptionStatus: isActive ? 'active' : 'inactive',
              subscriptionType: subscription?.paymentType || 'N/A',
              paymentPlan: subscription?.paymentPlan,
              joinedDate: subscription?.createdAt?.toDate() || userData.createdAt?.toDate(),
            });
          }
          setMembers(membersData);
        } else {
          // Fetch ALL registered students by program (show everyone)
          const usersQuery = query(
            collection(db, 'users'),
            where('program', '==', currentTab.program)
          );
          const usersSnapshot = await getDocs(usersQuery);
          
          const membersData = [];
          for (const doc of usersSnapshot.docs) {
            const userData = doc.data();
            if (userData.isAdmin) continue;
            
            // Check if user has active subscription for this organization
            const subscriptionsQuery = query(
              collection(db, 'subscriptions'),
              where('userId', '==', userData.uid),
              where('type', '==', 'organization'),
              where('organizationId', '==', activeTab)
            );
            const subscriptionsSnapshot = await getDocs(subscriptionsQuery);
            
            // Check for active subscription (not expired)
            let hasActiveSubscription = false;
            let subscription = null;
            const now = new Date();
            
            for (const subDoc of subscriptionsSnapshot.docs) {
              const subData = subDoc.data();
              if (subData.status === 'active') {
                const endDate = subData.endDate?.toDate?.() || subData.endDate;
                if (!endDate || new Date(endDate) >= now) {
                  hasActiveSubscription = true;
                  subscription = subData;
                  break;
                }
              }
            }
            
            // Also check members collection
            const membersQuery = query(
              collection(db, 'members'),
              where('userId', '==', userData.uid),
              where('organizationId', '==', activeTab)
            );
            const membersSnapshot = await getDocs(membersQuery);
            const memberData = membersSnapshot.docs[0]?.data();
            
            const isActive = hasActiveSubscription || (memberData?.status === 'active');
            
            membersData.push({
              id: userData.uid,
              ...userData,
              subscriptionStatus: isActive ? 'active' : 'inactive',
              subscriptionType: subscription?.paymentType || memberData?.paymentPlan || 'N/A',
              paymentPlan: subscription?.paymentPlan || memberData?.paymentPlan,
              joinedDate: subscription?.createdAt?.toDate() || memberData?.createdAt?.toDate() || memberData?.joinedAt?.toDate() || userData.createdAt?.toDate(),
            });
          }
          setMembers(membersData);
        }
      } catch (err) {
        console.error('Error in fallback fetch:', err);
      } finally {
        setLoading(false);
      }
    };

    return () => unsubscribe();
  }, [activeTab]);

  useEffect(() => {
    applyFilters();
  }, [members, blockFilter, yearFilter, programFilter]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const currentTab = tabs.find(t => t.id === activeTab);
      
      // First, try to fetch from members collection
      let membersQuery;
      if (activeTab === 'council') {
        membersQuery = query(
          collection(db, 'members'),
          where('organizationId', '==', 'student_council')
        );
      } else {
        membersQuery = query(
          collection(db, 'members'),
          where('organizationId', '==', activeTab)
        );
      }
      
      const membersSnapshot = await getDocs(membersQuery);
      
      if (!membersSnapshot.empty) {
        // Use members collection data (filter to ensure only registered students)
        const membersData = [];
        for (const doc of membersSnapshot.docs) {
          const data = doc.data();
          
          // Verify user exists in users collection and is not an admin
          if (data.userId) {
            try {
              const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', data.userId)));
              if (!userDoc.empty) {
                const userData = userDoc.docs[0].data();
                // Only include registered students (exclude admins)
                if (userData.isAdmin) {
                  continue;
                }
              } else {
                // User doesn't exist in users collection, skip
                continue;
              }
            } catch (err) {
              console.error('Error verifying user:', err);
              // Continue anyway if verification fails
            }
          }
          
          membersData.push({
            id: data.userId,
            ...data,
            subscriptionStatus: data.status || 'active',
            subscriptionType: data.paymentPlan || 'N/A',
            paymentPlan: data.paymentPlan,
            semesterType: data.semesterType,
            semesterLabel: data.semesterLabel,
            joinedDate: data.joinedAt?.toDate() || data.createdAt?.toDate() || null,
        });
        }
        setMembers(membersData);
      } else {
        // Fallback to subscriptions
        if (activeTab === 'council') {
          // Fetch council members from subscriptions
          const subscriptionsQuery = query(
            collection(db, 'subscriptions'),
            where('type', '==', 'council'),
            where('status', '==', 'active')
          );
          const subscriptionsSnapshot = await getDocs(subscriptionsQuery);
          
          // Get unique user IDs
          const userIds = [...new Set(subscriptionsSnapshot.docs.map(doc => doc.data().userId))];
          
          // Fetch user details for each council member (only registered students, exclude admins)
          const membersData = [];
          for (const userId of userIds) {
            const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', userId)));
            if (!userDoc.empty) {
              const userData = userDoc.docs[0].data();
              
              // Only include registered students (exclude admins)
              if (userData.isAdmin) {
                continue;
              }
              
              const subscription = subscriptionsSnapshot.docs.find(doc => doc.data().userId === userId)?.data();
              membersData.push({
                id: userId,
                ...userData,
                subscriptionStatus: subscription?.status || 'inactive',
                subscriptionType: subscription?.paymentType || 'N/A',
                paymentPlan: subscription?.paymentPlan,
                semesterType: subscription?.semesterType,
                semesterLabel: subscription?.semesterLabel,
                joinedDate: subscription?.createdAt?.toDate() || null,
              });
            }
          }
          setMembers(membersData);
        } else {
          // Fetch ALL registered students by program (show everyone, not just those who paid)
          const usersQuery = query(
            collection(db, 'users'),
            where('program', '==', currentTab.program)
          );
          const usersSnapshot = await getDocs(usersQuery);
          
          const membersData = [];
          for (const doc of usersSnapshot.docs) {
            const userData = doc.data();
            
            // Only include registered students (exclude admins)
            if (userData.isAdmin) {
              continue;
            }
            
            // Check if user has active subscription for this organization
            const subscriptionsQuery = query(
              collection(db, 'subscriptions'),
              where('userId', '==', userData.uid),
              where('type', '==', 'organization'),
              where('organizationId', '==', activeTab)
            );
            const subscriptionsSnapshot = await getDocs(subscriptionsQuery);
            
            // Check for active subscription (not expired)
            let hasActiveSubscription = false;
            let subscription = null;
            const now = new Date();
            
            for (const subDoc of subscriptionsSnapshot.docs) {
              const subData = subDoc.data();
              if (subData.status === 'active') {
                const endDate = subData.endDate?.toDate?.() || subData.endDate;
                if (!endDate || new Date(endDate) >= now) {
                  hasActiveSubscription = true;
                  subscription = subData;
                  break;
                }
              }
            }
            
            // Also check members collection for status
            const membersQuery = query(
              collection(db, 'members'),
              where('userId', '==', userData.uid),
              where('organizationId', '==', activeTab)
            );
            const membersSnapshot = await getDocs(membersQuery);
            const memberData = membersSnapshot.docs[0]?.data();
            
            // Status is active if they have active subscription or active member record
            const isActive = hasActiveSubscription || (memberData?.status === 'active');
            
            membersData.push({
              id: userData.uid,
              ...userData,
              subscriptionStatus: isActive ? 'active' : 'inactive',
              subscriptionType: subscription?.paymentType || memberData?.paymentPlan || 'N/A',
              paymentPlan: subscription?.paymentPlan || memberData?.paymentPlan,
              semesterType: subscription?.semesterType || memberData?.semesterType,
              semesterLabel: subscription?.semesterLabel || memberData?.semesterLabel,
              joinedDate: subscription?.createdAt?.toDate() || memberData?.createdAt?.toDate() || memberData?.joinedAt?.toDate() || userData.createdAt?.toDate(),
            });
          }
          setMembers(membersData);
        }
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...members];
    
    if (blockFilter) {
      filtered = filtered.filter(m => m.block?.toLowerCase() === blockFilter.toLowerCase());
    }
    
    if (yearFilter) {
      filtered = filtered.filter(m => m.year?.toString() === yearFilter);
    }
    
    if (programFilter && activeTab === 'council') {
      filtered = filtered.filter(m => m.program === programFilter);
    }
    
    setFilteredMembers(filtered);
  };

  const clearFilters = () => {
    setBlockFilter('');
    setYearFilter('');
    setProgramFilter('');
  };

  const displayMembers = filteredMembers.length > 0 || blockFilter || yearFilter || programFilter ? filteredMembers : members;

  return (
    <div className="space-y-0">
      {/* Organization Header */}
      <div className={`${tabs.find(t => t.id === activeTab)?.bgColor} text-white p-6 rounded-t-lg`}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-3xl font-bold">
            {tabs.find(t => t.id === activeTab)?.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{tabs.find(t => t.id === activeTab)?.name}</h1>
            <p className="text-white text-opacity-90 mt-1">{tabs.find(t => t.id === activeTab)?.fullName}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                pb-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? `border-${tab.color}-500 text-${tab.color}-600`
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }
              `}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
          {(blockFilter || yearFilter || programFilter) && (
            <button
              onClick={clearFilters}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Clear All
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Block</label>
            <input
              type="text"
              value={blockFilter}
              onChange={(e) => setBlockFilter(e.target.value)}
              placeholder="e.g., A, B, C"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-900"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Year</label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-900"
            >
              <option value="">All Years</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>
          
          {activeTab === 'council' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Program</label>
              <select
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-900"
              >
                <option value="">All Programs</option>
                <option value="BSIT">BSIT</option>
                <option value="BSCS">BSCS</option>
                <option value="BSEMC">BSEMC</option>
              </select>
            </div>
          )}
          
          <div className="flex items-end">
            <div className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{displayMembers.length}</span> member{displayMembers.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white border border-slate-200 overflow-hidden">
        {/* Status Filter Tabs */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg">
              All ({displayMembers.length})
            </button>
            <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
              Active ({displayMembers.filter(m => m.status === 'active').length})
            </button>
            <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
              Inactive ({displayMembers.filter(m => m.status === 'inactive').length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : displayMembers.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="mt-4 text-slate-600">No members found</p>
            {(blockFilter || yearFilter || programFilter) && (
              <button
                onClick={clearFilters}
                className="mt-2 text-orange-600 hover:text-orange-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Student ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Program</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Year Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Payment Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {displayMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {member.firstName?.[0]}{member.lastName?.[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">
                            {member.firstName} {member.lastName}
                          </div>
                          <div className="text-sm text-slate-500">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{member.studentId || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{member.program}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{member.year ? `${member.year}${getOrdinalSuffix(member.year)} Year` : 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {member.paymentPlan ? (
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          member.paymentPlan === 'full'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {member.paymentPlan === 'full' ? '₱60 Full Year' : '₱30 1 Semester'}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {member.joinedDate ? new Date(member.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.subscriptionStatus === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {member.subscriptionStatus === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-900 font-medium">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
