'use client';

import { useState } from 'react';

export default function AdminPaymentsPage() {
  const [filter, setFilter] = useState('all');

  const payments = [
    { id: 'PAY-001', student: 'Juan Dela Cruz', organization: 'ELITES', amount: 500, date: '2025-12-07', status: 'completed', method: 'GCash' },
    { id: 'PAY-002', student: 'Maria Santos', organization: 'SPECS', amount: 350, date: '2025-12-05', status: 'completed', method: 'PayMaya' },
    { id: 'PAY-003', student: 'Pedro Garcia', organization: 'ELITES', amount: 250, date: '2025-12-01', status: 'pending', method: 'GCash' },
    { id: 'PAY-004', student: 'Michael Tan', organization: 'IMAGES', amount: 450, date: '2025-11-28', status: 'completed', method: 'Bank Transfer' },
    { id: 'PAY-005', student: 'Sarah Lee', organization: 'IMAGES', amount: 300, date: '2025-11-25', status: 'failed', method: 'GCash' },
    { id: 'PAY-006', student: 'Alex Chen', organization: 'ELITES', amount: 400, date: '2025-11-20', status: 'completed', method: 'GCash' },
  ];

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
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{payment.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{payment.student}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${
                      payment.organization === 'SPECS' ? 'bg-purple-100 text-purple-700' :
                      payment.organization === 'IMAGES' ? 'bg-green-100 text-green-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {payment.organization}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">₱{payment.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(payment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
