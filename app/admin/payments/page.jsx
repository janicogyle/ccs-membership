'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AdminPaymentsPage() {
  const [filter, setFilter] = useState('all');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all transactions (excluding cash_ins)
      const transactionsSnapshot = await getDocs(query(
        collection(db, 'transactions'),
        orderBy('createdAt', 'desc')
      ));

      const allTransactions = transactionsSnapshot.docs
        .filter(doc => {
          const data = doc.data();
          return data.type !== 'cash_in';
        })
        .map(doc => {
          const data = doc.data();
          const createdAt = data.createdAt?.toDate?.() || (data.createdAt ? new Date(data.createdAt) : new Date());
          
          return {
            id: doc.id,
            transactionId: doc.id,
            userId: data.userId,
            student: data.userName || data.name || 'Unknown',
            organization: data.organizationName || data.organizationId || '—',
            amount: Number(data.amount) || 0,
            date: createdAt,
            status: data.status || 'pending',
            method: data.method || data.provider || 'Wallet',
          };
        });

      // Fetch user names for transactions that don't have userName
      const userIds = [...new Set(allTransactions
        .filter(t => t.userId && !t.student.includes('Unknown'))
        .map(t => t.userId)
        .filter(Boolean)
      )];

      const usersMap = new Map();
      for (const userId of userIds) {
        try {
          const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', userId)));
          if (!userDoc.empty) {
            const userData = userDoc.docs[0].data();
            const userName = userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email || 'Unknown';
            usersMap.set(userId, userName);
          }
        } catch (err) {
          console.error('Error fetching user name:', err);
        }
      }

      // Update student names
      const paymentsWithNames = allTransactions.map(payment => ({
        ...payment,
        student: usersMap.get(payment.userId) || payment.student,
      }));

      setPayments(paymentsWithNames);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to load payments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = filter === 'all' ? payments : payments.filter(p => p.status === filter);
  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const pendingRevenue = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-500">Total Revenue</p>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">₱{totalRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-500">Total Transactions</p>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{payments.length}</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-500">Pending Amount</p>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">₱{pendingRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters and Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Payment History</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all' ? 'bg-purple-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'completed' ? 'bg-purple-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'pending' ? 'bg-purple-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('failed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'failed' ? 'bg-purple-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Failed
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Organization</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Method</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-sm text-slate-500">
                    Loading payments...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-sm text-red-600">
                    {error}
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-sm text-slate-500">
                    No payments found for the selected filter.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{payment.transactionId.substring(0, 8)}...</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{payment.student}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${
                        payment.organization === 'SPECS' ? 'bg-purple-100 text-purple-700' :
                        payment.organization === 'IMAGES' ? 'bg-green-100 text-green-700' :
                        payment.organization === 'ELITES' ? 'bg-blue-100 text-blue-700' :
                        payment.organization === 'Student Council' ? 'bg-orange-100 text-orange-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {payment.organization}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">₱{payment.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {payment.date instanceof Date 
                        ? payment.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : new Date(payment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{payment.method}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'completed' ? 'bg-green-100 text-green-700' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">View</button>
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
