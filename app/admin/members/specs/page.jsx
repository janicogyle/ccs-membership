'use client';

import { useState } from 'react';

export default function SpecsMembersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const members = [
    { id: 1, name: 'Juan Dela Cruz', studentId: '2023-10001', program: 'BSEMC', year: '3rd Year', status: 'active', joinDate: '2024-09-01' },
    { id: 2, name: 'Maria Santos', studentId: '2023-10002', program: 'BSEMC', year: '2nd Year', status: 'active', joinDate: '2024-09-05' },
    { id: 3, name: 'Pedro Garcia', studentId: '2023-10003', program: 'BSEMC', year: '4th Year', status: 'active', joinDate: '2024-09-03' },
    { id: 4, name: 'Anna Reyes', studentId: '2023-10004', program: 'BSEMC', year: '1st Year', status: 'inactive', joinDate: '2024-09-10' },
  ];

  const filteredMembers = members.filter(member =>
    (filter === 'all' || member.status === filter) &&
    (member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     member.studentId.includes(searchTerm))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <span className="text-3xl font-bold">S</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold">SPECS Members</h2>
            <p className="text-purple-100">Society of Progressive Entertainment and Communication Students</p>
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
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                filter === 'all' ? 'bg-purple-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({members.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                filter === 'active' ? 'bg-purple-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('inactive')}
              className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                filter === 'inactive' ? 'bg-purple-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-semibold text-sm">{member.name.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-slate-900">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{member.studentId}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{member.program}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{member.year}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(member.joinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      member.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
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
