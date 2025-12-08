'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalMembers: 0,
    specsMembers: 0,
    imagesMembers: 0,
    elitesMembers: 0,
    totalPayments: 0,
    pendingPayments: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all users from Firestore
        const usersSnapshot = await getDocs(collection(db, 'users'))
        const totalMembers = usersSnapshot.size

        // For now, we'll use mock data for organization-specific stats
        // You can update this later when you have organization data in Firestore
        setStats({
          totalMembers,
          specsMembers: Math.floor(totalMembers * 0.35),
          imagesMembers: Math.floor(totalMembers * 0.40),
          elitesMembers: Math.floor(totalMembers * 0.25),
          totalPayments: 25000,
          pendingPayments: 5000,
        })
      } catch (err) {
        console.error('Error loading statistics:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const recentActivities = [
    { type: 'member', user: 'Juan Dela Cruz', action: 'Joined ELITES organization', time: '2 hours ago' },
    { type: 'payment', user: 'Maria Santos', action: 'Payment received - ₱500', time: '3 hours ago' },
    { type: 'member', user: 'Pedro Garcia', action: 'Joined SPECS organization', time: '5 hours ago' },
    { type: 'payment', user: 'Anna Reyes', action: 'Payment received - ₱350', time: '6 hours ago' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0] || 'Admin'}!</h2>
        <p className="text-purple-100">Here's what's happening with the CCS organizations today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-1">Total Members</p>
          <p className="text-3xl font-bold text-slate-900">{stats.totalMembers}</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-1">Organizations</p>
          <p className="text-3xl font-bold text-slate-900">3</p>
          <p className="text-xs text-slate-400 mt-2">SPECS, IMAGES, ELITES</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-1">Total Payments</p>
          <p className="text-3xl font-bold text-slate-900">₱{stats.totalPayments.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-1">Pending Payments</p>
          <p className="text-3xl font-bold text-slate-900">₱{stats.pendingPayments.toLocaleString()}</p>
        </div>
      </div>

      {/* Organization Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border-2 border-purple-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-purple-600">S</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">SPECS</h3>
              <p className="text-sm text-slate-500">BSEMC Organization</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Total Members</span>
              <span className="text-2xl font-bold text-purple-600">{stats.specsMembers}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-green-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-green-600">I</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">IMAGES</h3>
              <p className="text-sm text-slate-500">BSCS Organization</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Total Members</span>
              <span className="text-2xl font-bold text-green-600">{stats.imagesMembers}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-blue-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">E</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">ELITES</h3>
              <p className="text-sm text-slate-500">BSIT Organization</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Total Members</span>
              <span className="text-2xl font-bold text-blue-600">{stats.elitesMembers}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                activity.type === 'payment' ? 'bg-green-100' : 'bg-blue-100'
              }`}>
                {activity.type === 'payment' ? (
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">{activity.user}</p>
                <p className="text-sm text-slate-600">{activity.action}</p>
                <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  )
}
