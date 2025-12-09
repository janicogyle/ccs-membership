'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  increment,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';

export default function StudentDashboard() {
  const { user } = useAuth();
  const isSimulator = process.env.NEXT_PUBLIC_PAYMONGO_SIMULATOR === 'true';
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCashIn, setShowCashIn] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [cashInAmount, setCashInAmount] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState('student_council'); // Default to Student Council
  const [paymentType, setPaymentType] = useState('council_full');
  const [processing, setProcessing] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState([]);
  
  // Stats from database
  const [activeSubscriptions, setActiveSubscriptions] = useState([]);
  const [totalPayments, setTotalPayments] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [userProgram, setUserProgram] = useState('');

  // Fetch user program from Firestore
  useEffect(() => {
    const fetchUserProgram = async () => {
      if (!user?.uid) return;
      
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserProgram(userData.program || user.program || '');
        } else {
          setUserProgram(user.program || '');
        }
      } catch (err) {
        console.error('Error fetching user program:', err);
        setUserProgram(user.program || '');
      }
    };

    fetchUserProgram();
  }, [user]);

  // Dynamic organizations based on subscriptions and user program - synced with membership status
  const organizations = useMemo(() => {
    // All possible organizations
    const allOrgs = [
      { id: 'student_council', name: 'Student Council', program: 'CCS Student Government', color: 'orange', programMatch: null }, // Always show
      { id: 'elites', name: 'ELITES', program: 'Student Council Extension • BSIT', color: 'blue', programMatch: 'BSIT' },
      { id: 'specs', name: 'SPECS', program: 'Student Council Extension • BSCS', color: 'purple', programMatch: 'BSCS' },
      { id: 'images', name: 'IMAGES', program: 'Student Council Extension • BSEMC', color: 'green', programMatch: 'BSEMC' },
    ];
    
    // Filter organizations based on user's program
    const orgList = allOrgs.filter(org => {
      // Always show Student Council
      if (org.id === 'student_council') return true;
      
      // Show organization only if it matches user's program
      if (!userProgram) return false; // If no program, don't show any org-specific ones
      
      return org.programMatch === userProgram;
    });
    
    return orgList.map(org => {
      // Find matching subscription - check both organizationId and organizationName
      const subscription = activeSubscriptions.find(sub => {
        const subOrgId = sub.organizationId || '';
        const subOrgName = (sub.organizationName || '').toLowerCase();
        const orgId = org.id.toLowerCase();
        const orgName = org.name.toLowerCase();
        
        return subOrgId === org.id || 
               subOrgId === orgId ||
               subOrgName === orgName ||
               subOrgName.includes(orgName) ||
               orgName.includes(subOrgName);
      });
      
      // Check if subscription is still active (not expired)
      let isActive = subscription && subscription.status === 'active';
      let expiresAt = null;
      if (subscription?.endDate) {
        expiresAt = subscription.endDate?.toDate?.() || subscription.endDate;
        // Check if expired
        if (expiresAt && expiresAt < new Date()) {
          isActive = false;
        }
      }
      
      return {
        ...org,
        status: isActive ? 'Active' : 'Inactive',
        paymentPlan: subscription?.paymentPlan || null,
        duration: subscription?.duration || null,
        expiresAt: expiresAt,
      };
    });
  }, [activeSubscriptions, userProgram]);
  
  // Calculate active memberships count for membership status card
  const activeMembershipsCount = useMemo(() => {
    return organizations.filter(org => org.status === 'Active').length;
  }, [organizations]);

  // Organization options filtered by user program
  const organizationOptions = useMemo(() => {
    const allOptions = [
      {
        id: 'student_council',
        name: 'Student Council',
        tagline: 'CCS Department Student Government',
        badgeClass: 'bg-emerald-100 text-emerald-700',
        iconEmoji: '🏛️',
        programMatch: null, // Always available
      },
      {
        id: 'elites',
        name: 'ELITES',
        tagline: 'Student Council Extension • BSIT',
        badgeClass: 'bg-blue-100 text-blue-700',
        iconEmoji: '💻',
        programMatch: 'BSIT',
      },
      {
        id: 'specs',
        name: 'SPECS',
        tagline: 'Student Council Extension • BSCS',
        badgeClass: 'bg-purple-100 text-purple-700',
        iconEmoji: '🎬',
        programMatch: 'BSCS',
      },
      {
        id: 'images',
        name: 'IMAGES',
        tagline: 'Student Council Extension • BSEMC',
        badgeClass: 'bg-green-100 text-green-700',
        iconEmoji: '🚀',
        programMatch: 'BSEMC',
      },
    ];

    // Filter based on user's program
    return allOptions.filter(option => {
      if (option.id === 'student_council') return true; // Always show Student Council
      if (!userProgram) return false; // If no program, don't show org-specific ones
      return option.programMatch === userProgram;
    });
  }, [userProgram]);

  const selectedOrganizationMeta = useMemo(
    () => organizationOptions.find((option) => option.id === selectedOrganization) ?? organizationOptions[0],
    [organizationOptions, selectedOrganization]
  );

  const isCouncilSelected = selectedOrganizationMeta?.id === 'student_council';

  const paymentOptions = useMemo(
    () =>
      isCouncilSelected
        ? [
            {
              id: 'council_full',
              label: 'Council Full Payment',
              description: 'Student Council dues - Full year access',
              amount: 60,
              chipClass: 'bg-emerald-100 text-emerald-700',
            },
            {
              id: 'council_half',
              label: 'Council Half Payment',
              description: 'Student Council dues - 1 semester',
              amount: 30,
              chipClass: 'bg-emerald-100 text-emerald-700',
            },
          ]
        : [
            {
              id: 'organization_full',
              label: 'Organization Full Payment',
              description: 'Organization membership - Full year',
              amount: 60,
              chipClass: 'bg-blue-100 text-blue-700',
            },
            {
              id: 'organization_half',
              label: 'Organization Half Payment',
              description: 'Organization membership - 1 semester',
              amount: 30,
              chipClass: 'bg-blue-100 text-blue-700',
            },
          ],
    [isCouncilSelected]
  );

  const selectedPaymentOption = useMemo(
    () => paymentOptions.find((option) => option.id === paymentType) ?? paymentOptions[0],
    [paymentOptions, paymentType]
  );

  const paymentAmount = selectedPaymentOption?.amount ?? 0;
  const organizationDisplayName = selectedOrganizationMeta?.name ?? 'Organization';
  const insufficientBalance = walletBalance < paymentAmount;

  useEffect(() => {
    if (user?.uid) {
      fetchWalletBalance();
    }
  }, [user]);

  // Fetch active subscriptions from database - real-time sync
  useEffect(() => {
    if (!user?.uid) {
      setActiveSubscriptions([]);
      return;
    }

    const subscriptionsQuery = query(
      collection(db, 'subscriptions'),
      where('userId', '==', user.uid),
      where('status', '==', 'active')
    );

    const unsubscribe = onSnapshot(subscriptionsQuery, (snapshot) => {
      const now = new Date();
      const subs = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            endDate: data.endDate?.toDate?.() || data.endDate,
          };
        })
        .filter(sub => {
          // Filter out expired subscriptions
          if (sub.endDate) {
            const endDate = sub.endDate instanceof Date ? sub.endDate : new Date(sub.endDate);
            return endDate >= now;
          }
          return true; // If no endDate, assume active
        });
      setActiveSubscriptions(subs);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Fetch all transactions for stats
  useEffect(() => {
    if (!user?.uid) {
      setTotalPayments(0);
      setTransactionCount(0);
      return;
    }

    const allTransactionsQuery = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(allTransactionsQuery, (snapshot) => {
      let total = 0;
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        // Only count payments (not cash-ins) for total payments
        if (data.type !== 'cash_in' && data.status === 'completed') {
          total += Number(data.amount) || 0;
        }
      });
      setTotalPayments(total);
      setTransactionCount(snapshot.docs.length);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Fetch recent transactions (limit 5)
  useEffect(() => {
    if (!user?.uid) {
      setRecentTransactions([]);
      return;
    }

    // Use query without orderBy to avoid index requirement, then sort in memory
    const transactionsQuery = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(transactionsQuery, (snapshot) => {
      const items = snapshot.docs
        .map((docSnap) => {
          const data = docSnap.data();
          const createdAt = data.createdAt?.toDate?.() ?? (data.createdAt ? new Date(data.createdAt) : null);
          const amountValue = Number(data.amount) || 0;
          const isCashIn = data.type === 'cash_in';
          const dateLabel = createdAt
            ? createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : '—';

          // Use same description format as payment history page
          const description = data.description || 
            (isCashIn ? 'Wallet cash-in' : 
             data.organizationName ? `${data.organizationName} - Membership payment` : 
             'Membership payment');

          return {
            id: docSnap.id,
            type: data.type || 'payment',
            description: description,
            date: dateLabel,
            amount: amountValue ? `${isCashIn ? '+' : '-'}₱${amountValue.toFixed(2)}` : null,
            status: data.status || 'completed',
            organization: data.organizationName || data.subscriptionType || '—',
            createdAt: createdAt, // Store full date for consistency
          };
        })
        .sort((a, b) => {
          // Sort by createdAt descending (newest first)
          const aTime = a.createdAt?.getTime() || 0;
          const bTime = b.createdAt?.getTime() || 0;
          return bTime - aTime;
        })
        .slice(0, 5); // Limit to 5 most recent

      setRecentTransactions(items);
    }, (error) => {
      console.error('Error fetching recent transactions:', error);
      setRecentTransactions([]);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  useEffect(() => {
    const shouldLockScroll = showCashIn || showPayment;
    if (shouldLockScroll) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
    document.body.style.overflow = '';
    return undefined;
  }, [showCashIn, showPayment]);

  // Update selected organization when user program changes
  useEffect(() => {
    if (!userProgram) return;
    
    // If current selection is not available for this program, switch to appropriate default
    const availableOrgIds = organizationOptions.map(opt => opt.id);
    
    if (!availableOrgIds.includes(selectedOrganization)) {
      // Set to Student Council if available, otherwise first available org
      if (availableOrgIds.includes('student_council')) {
        setSelectedOrganization('student_council');
        setPaymentType('council_full');
      } else if (availableOrgIds.length > 0) {
        setSelectedOrganization(availableOrgIds[0]);
        setPaymentType('organization_full');
      }
    }
  }, [userProgram, organizationOptions, selectedOrganization]);

  useEffect(() => {
    if (!paymentOptions.length) {
      return;
    }
    if (!paymentOptions.some((option) => option.id === paymentType)) {
      setPaymentType(paymentOptions[0].id);
    }
  }, [paymentOptions, paymentType]);

  const fetchWalletBalance = async () => {
    try {
      const walletRef = doc(db, 'wallets', user.uid);
      const walletSnap = await getDoc(walletRef);
      
      if (walletSnap.exists()) {
        setWalletBalance(walletSnap.data().balance || 0);
      } else {
        // Create wallet document if it doesn't exist
        await setDoc(walletRef, {
          userId: user.uid,
          balance: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        setWalletBalance(0);
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCashIn = async () => {
    const amount = parseFloat(cashInAmount);

    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (amount < 100) {
      alert('Minimum cash-in amount is ₱100');
      return;
    }

    if (!user?.uid) {
      alert('You must be logged in to cash in.');
      return;
    }

    try {
      setProcessing(true);

      // Call PayMongo API to create checkout session
      const response = await fetch('/api/paymongo/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount,
          userId: user.uid,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to PayMongo checkout page
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error processing cash-in:', error);
      alert(error.message || 'Failed to process payment. Please try again.');
      setProcessing(false);
    }
  };

  const handleMembershipPayment = async () => {
    if (!selectedPaymentOption) {
      alert('Please choose a payment plan.');
      return;
    }

    const isCouncil = selectedPaymentOption.id.startsWith('council');
    const isHalf = selectedPaymentOption.id.endsWith('half');
    const subscriptionType = isCouncil ? 'council' : 'organization';
    const paymentLabel = selectedPaymentOption.label;
    const subscriptionDurationDays = isHalf ? 180 : 365;

    if (walletBalance < paymentAmount) {
      alert('Insufficient balance. Please cash-in first.');
      return;
    }

    if (!confirm(`Confirm ${paymentLabel} for ${organizationDisplayName} amounting to ₱${paymentAmount}?`)) {
      return;
    }

    setProcessing(true);
    try {
      const walletRef = doc(db, 'wallets', user.uid);
      const walletSnap = await getDoc(walletRef);
      
      if (!walletSnap.exists()) {
        throw new Error('Wallet not found. Please refresh the page.');
      }
      
      await updateDoc(walletRef, {
        balance: increment(-paymentAmount),
        updatedAt: new Date()
      });

      await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        type: 'subscription',
        subscriptionType: subscriptionType,
        organizationId: selectedOrganizationMeta?.id ?? selectedOrganization,
        organizationName: organizationDisplayName,
        paymentType: paymentType,
        paymentPlan: isHalf ? 'half' : 'full',
        duration: isHalf ? '1 Semester' : 'Full Year',
        description: `${organizationDisplayName} - ${selectedPaymentOption?.label ?? 'Membership payment'} (${isHalf ? '1 Semester' : 'Full Year'})`,
        method: 'Wallet balance',
        amount: paymentAmount,
        status: 'completed',
        createdAt: new Date()
      });

      // Create subscription record
      await addDoc(collection(db, 'subscriptions'), {
        userId: user.uid,
        userName: user.name || user.firstName + ' ' + user.lastName || user.email,
        userEmail: user.email,
        organizationId: selectedOrganizationMeta?.id ?? selectedOrganization,
        organizationName: organizationDisplayName,
        type: subscriptionType,
        paymentType: paymentType,
        paymentPlan: isHalf ? 'half' : 'full',
        duration: isHalf ? '1 Semester' : 'Full Year',
        amount: paymentAmount,
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + subscriptionDurationDays * 24 * 60 * 60 * 1000),
        createdAt: new Date()
      });

      // Register as member in the members collection - ensures it shows in admin list
      const memberName = user.name || (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email);
      await addDoc(collection(db, 'members'), {
        userId: user.uid,
        name: memberName,
        userName: memberName, // Also store as userName for consistency
        email: user.email,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        program: user.program || '',
        year: user.year || '',
        block: user.block || '',
        organizationId: selectedOrganizationMeta?.id ?? selectedOrganization,
        organizationName: organizationDisplayName,
        membershipType: subscriptionType,
        paymentPlan: isHalf ? 'half' : 'full',
        duration: isHalf ? '1 Semester' : 'Full Year',
        amountPaid: paymentAmount,
        status: 'active',
        memberSince: new Date(),
        joinedAt: new Date(), // Also store as joinedAt for admin display
        expiresAt: new Date(Date.now() + subscriptionDurationDays * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await fetchWalletBalance();
      setShowPayment(false);
      alert(`Payment successful! You are now a member of ${organizationDisplayName} (${isHalf ? '1 Semester' : 'Full Year'}).`);
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Failed to process payment');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black mb-2">Dashboard</h1>
            <p className="text-orange-100 text-lg">Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋</p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* (Removed old dual balance cards section) */}

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-orange-100 text-sm mb-3">Available Balance</p>
            <h2 className="text-5xl font-bold">₱{walletBalance.toFixed(2)}</h2>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowCashIn(true)}
            className="flex-1 bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors"
          >
            Cash In (Simulated)
          </button>
          <button
            onClick={() => setShowPayment(true)}
            className="flex-1 bg-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors"
          >
            Pay Membership
          </button>
        </div>
      </div>

      {/* Cash In Modal */}
      {showCashIn && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/85 px-4 py-6 backdrop-blur-sm"
          onClick={() => setShowCashIn(false)}
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-slate-900">Cash In (Simulation)</h3>
              <button onClick={() => setShowCashIn(false)} className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Amount (₱)</label>
              <input
                type="number"
                value={cashInAmount}
                onChange={(e) => setCashInAmount(e.target.value)}
                placeholder="Enter amount (min ₱100)"
                min="100"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-900"
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-amber-800">
                <span className="font-semibold">🧪 Simulation Mode:</span> This will instantly add funds to your wallet for testing. No real payment is processed.
              </p>
            </div>

            <button
              onClick={handleCashIn}
              disabled={processing}
              className="w-full px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              {processing ? 'Processing...' : 'Simulate Cash In'}
            </button>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/85 px-4 py-6 backdrop-blur-sm"
          onClick={() => setShowPayment(false)}
        >
          <div
            className="bg-white max-h-[calc(100vh-3rem)] w-full max-w-md overflow-y-auto rounded-2xl p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-slate-900">Pay Membership</h3>
              <button onClick={() => setShowPayment(false)} className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              <fieldset className="space-y-3">
                <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-orange-600">Choose Organization</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {organizationOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`relative flex w-full cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition hover:border-orange-300 focus-within:ring-2 focus-within:ring-orange-400 ${
                        selectedOrganization === option.id ? 'border-orange-500 bg-orange-50 shadow-sm' : 'border-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="organization"
                        value={option.id}
                        checked={selectedOrganization === option.id}
                        onChange={() => setSelectedOrganization(option.id)}
                        className="sr-only"
                      />
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-2xl">
                        {option.iconEmoji}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{option.name}</p>
                        <span className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${option.badgeClass}`}>
                          {option.tagline}
                        </span>
                      </div>
                      {selectedOrganization === option.id && (
                        <svg className="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </label>
                  ))}
                </div>
                <p className="text-xs text-slate-500">
                  The Student Council serves as the CCS Student Government. ELITES, SPECS, and IMAGES operate as course-specific extensions of the council.
                </p>
              </fieldset>

              <fieldset className="space-y-3">
                <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-orange-600">Select Payment Plan</legend>
                <div className="space-y-3">
                  {paymentOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`flex w-full cursor-pointer flex-col gap-3 rounded-xl border-2 p-4 transition hover:border-orange-300 focus-within:ring-2 focus-within:ring-orange-400 ${
                        paymentType === option.id ? 'border-orange-500 bg-orange-50 shadow-sm' : 'border-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentPlan"
                        value={option.id}
                        checked={paymentType === option.id}
                        onChange={() => setPaymentType(option.id)}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-900">{option.label}</p>
                          <p className="text-sm text-slate-600">{option.description}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${option.chipClass}`}>
                          ₱{option.amount.toFixed(2)}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-600">Paying For</span>
                  <span className="font-semibold text-slate-900">{organizationDisplayName}</span>
                </div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-600">Current Balance</span>
                  <span className="font-semibold text-slate-900">₱{walletBalance.toFixed(2)}</span>
                </div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-600">Payment Amount</span>
                  <span className="font-semibold text-slate-900">-₱{paymentAmount.toFixed(2)}</span>
                </div>
                <div className="mt-2 flex justify-between border-t border-slate-200 pt-2">
                  <span className="font-semibold text-slate-900">Remaining Balance</span>
                  <span className="font-bold text-slate-900">₱{(walletBalance - paymentAmount).toFixed(2)}</span>
                </div>
              </div>

              {insufficientBalance && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                  <span className="font-semibold">Insufficient balance.</span> Please cash-in first.
                </div>
              )}

              <button
                onClick={handleMembershipPayment}
                disabled={processing || insufficientBalance}
                className="w-full rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processing ? 'Processing...' : `Confirm ${selectedPaymentOption?.label ?? 'Payment'}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 - Orange - Active Subscriptions */}
        <div className="bg-white p-6 rounded-2xl border-l-4 border-orange-500 shadow-sm hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-2">Active Memberships</p>
              <h3 className="text-3xl font-black text-slate-900">{activeSubscriptions.length}</h3>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 2 - Blue - Total Payments */}
        <div className="bg-white p-6 rounded-2xl border-l-4 border-blue-500 shadow-sm hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-2">Total Payments</p>
              <h3 className="text-3xl font-black text-slate-900">₱{totalPayments.toFixed(0)}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 3 - Green - Membership Status - Synced with Organizations */}
        <div className="bg-white p-6 rounded-2xl border-l-4 border-green-500 shadow-sm hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-2">Membership Status</p>
              <h3 className={`text-3xl font-black ${activeMembershipsCount > 0 ? 'text-green-600' : 'text-slate-400'}`}>
                {activeMembershipsCount > 0 ? 'Active' : 'Inactive'}
              </h3>
              {activeMembershipsCount > 0 && (
                <p className="text-xs text-slate-500 mt-1">{activeMembershipsCount} active membership{activeMembershipsCount !== 1 ? 's' : ''}</p>
              )}
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 4 - Purple - Transaction Count */}
        <div className="bg-white p-6 rounded-2xl border-l-4 border-purple-500 shadow-sm hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-2">Total Transactions</p>
              <h3 className="text-3xl font-black text-slate-900">{transactionCount}</h3>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Organizations */}
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
          <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            Your Organizations
          </h3>
          <div className="space-y-4">
            {organizations.map((org, index) => {
              const colorMap = {
                blue: { bg: 'bg-blue-500', lightBg: 'bg-blue-100', icon: '💻' },
                purple: { bg: 'bg-purple-500', lightBg: 'bg-purple-100', icon: '🎬' },
                green: { bg: 'bg-green-500', lightBg: 'bg-green-100', icon: '🚀' },
                orange: { bg: 'bg-orange-500', lightBg: 'bg-orange-100', icon: '🏛️' }
              };
              const colors = colorMap[org.color];
              
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-5 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 ${colors.lightBg} rounded-xl flex items-center justify-center text-2xl`}>
                      {colors.icon}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-lg">{org.name}</p>
                      <p className="text-sm text-slate-500">{org.program}</p>
                      {org.status === 'Active' && org.duration && (
                        <p className="text-xs text-green-600 font-medium mt-1">
                          {org.duration} {org.paymentPlan === 'half' && '(Half Payment)'}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`
                        px-4 py-2 rounded-lg text-xs font-bold
                        ${org.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}
                      `}
                    >
                      {org.status}
                    </span>
                    {org.status === 'Active' && org.paymentPlan && (
                      <span className={`text-xs font-medium ${org.paymentPlan === 'full' ? 'text-blue-600' : 'text-orange-600'}`}>
                        {org.paymentPlan === 'full' ? '₱60 Full Year' : '₱30 1 Semester'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
          <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <p className="text-sm text-slate-500">No recent activity yet. Complete a cash-in or payment to see it here.</p>
            ) : (
              recentTransactions.map((activity) => {
                const isCashIn = activity.type === 'cash_in';
                return (
                  <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isCashIn ? 'bg-green-100' : 'bg-blue-100'
                      }`}
                    >
                      {isCashIn ? (
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5v2a3 3 0 01-3 3H3m6-5h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2v-4" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900">{activity.description}</p>
                      <p className="text-xs text-slate-500 mt-1">{activity.date}</p>
                    </div>
                    {activity.amount && (
                      <span className={`text-sm font-black ${isCashIn ? 'text-green-600' : 'text-slate-900'}`}>
                        {activity.amount}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
