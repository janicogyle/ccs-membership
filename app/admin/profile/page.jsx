'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function AdminProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="text-5xl font-bold">{user?.name?.charAt(0) || 'A'}</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-2">{user?.name || 'Admin'}</h2>
            <p className="text-purple-100 mb-2">{user?.email}</p>
            <span className="inline-flex px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              Super Admin
            </span>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Personal Information</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-500">Full Name</label>
              <p className="text-base text-slate-900 mt-1">{user?.name || 'Admin User'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">Email Address</label>
              <p className="text-base text-slate-900 mt-1">{user?.email || 'admin@example.com'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">Role</label>
              <p className="text-base text-slate-900 mt-1">Super Administrator</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">Department</label>
              <p className="text-base text-slate-900 mt-1">College of Computer Studies</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Account Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-slate-700">Account Status</span>
              <span className="inline-flex px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-slate-700">Two-Factor Auth</span>
              <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Enabled</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium text-slate-700">Access Level</span>
              <span className="inline-flex px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">Full Access</span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Permissions */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Administrator Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Manage Members', description: 'Add, edit, and remove organization members', enabled: true },
            { name: 'Financial Management', description: 'View and manage payment transactions', enabled: true },
            { name: 'Council Management', description: 'Manage council and officer positions', enabled: true },
            { name: 'System Settings', description: 'Configure system-wide settings', enabled: true },
            { name: 'User Administration', description: 'Manage admin and user accounts', enabled: true },
            { name: 'Reports & Analytics', description: 'Access detailed reports and analytics', enabled: true },
          ].map((permission, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                permission.enabled ? 'bg-green-100' : 'bg-slate-200'
              }`}>
                <svg className={`w-5 h-5 ${permission.enabled ? 'text-green-600' : 'text-slate-400'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{permission.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{permission.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
