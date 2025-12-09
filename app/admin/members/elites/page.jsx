'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ElitesMembersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch ELITES members from members collection
      const membersQuery = query(
        collection(db, 'members'),
        where('organizationId', '==', 'elites')
      );
      const membersSnapshot = await getDocs(membersQuery);

      const membersData = [];
      for (const doc of membersSnapshot.docs) {
        const data = doc.data();
        
        // Get user details from users collection
        let userData = null;
        if (data.userId) {
          try {
            const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', data.userId)));
            if (!userDoc.empty) {
              userData = userDoc.docs[0].data();
            }
          } catch (err) {
            console.error('Error fetching user data:', err);
          }
        }

        const createdAt = data.createdAt?.toDate?.() || data.memberSince?.toDate?.() || new Date();
        const name = data.name || data.userName || (userData ? (userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim()) : 'Unknown');
        const studentId = userData?.studentId || data.studentId || 'N/A';
        const program = userData?.program || data.program || 'BSIT';
        const year = userData?.year || data.year || null;

        membersData.push({
          id: doc.id,
          name,
          studentId,
          program,
          year: year ? `${year}${getOrdinalSuffix(year)} Year` : 'N/A',
          status: data.status || 'active',
          joinDate: createdAt,
        });
      }

      setMembers(membersData);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Failed to load members. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getOrdinalSuffix = (num) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
  };

  const filteredMembers = members.filter(member =>
    (filter === 'all' || member.status === filter) &&
    (member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     member.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <span className="text-3xl font-bold">E</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold">ELITES Members</h2>
            <p className="text-blue-100">Excellence in Information Technology Education Society</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or student ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                filter === 'all' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({members.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                filter === 'active' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('inactive')}
              className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                filter === 'inactive' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Member</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Student ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Program</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Year Level</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-500">
                    Loading members...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-red-600">
                    {error}
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-500">
                    No members found {searchTerm && `matching "${searchTerm}"`}
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">{member.name.charAt(0)}</span>
                        </div>
                        <span className="font-medium text-slate-900">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{member.studentId}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{member.program}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{member.year}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {member.joinDate instanceof Date
                        ? member.joinDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : new Date(member.joinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        member.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
