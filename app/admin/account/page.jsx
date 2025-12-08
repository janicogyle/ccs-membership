'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminAccountPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Account Settings</h2>
        <p className="text-slate-600">Manage your account preferences and security settings</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'general'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'security'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Security
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'notifications'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Notifications
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue={user?.name || 'Admin User'}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <input
                  type="email"
                  defaultValue={user?.email || 'admin@example.com'}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+63 XXX XXX XXXX"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                <textarea
                  rows={4}
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <button className="px-6 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors">
                Save Changes
              </button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">2FA is enabled</p>
                    <p className="text-sm text-slate-600">Your account is protected with two-factor authentication</p>
                  </div>
                  <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                    Manage
                  </button>
                </div>
              </div>
              <button className="px-6 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors">
                Update Password
              </button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              {[
                { title: 'New Member Registration', description: 'Get notified when a new member joins any organization', enabled: true },
                { title: 'Payment Notifications', description: 'Receive alerts for all payment transactions', enabled: true },
                { title: 'System Updates', description: 'Stay informed about system maintenance and updates', enabled: false },
                { title: 'Weekly Reports', description: 'Receive weekly summary of membership and payments', enabled: true },
                { title: 'Council Activities', description: 'Get notified about council meetings and events', enabled: true },
              ].map((notification, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="font-medium text-slate-900">{notification.title}</p>
                    <p className="text-sm text-slate-600">{notification.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={notification.enabled} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                  </label>
                </div>
              ))}
              <button className="px-6 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors mt-6">
                Save Preferences
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
