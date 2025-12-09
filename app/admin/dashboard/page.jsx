'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore'
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
  const [recentActivities, setRecentActivities] = useState([])

  // Helper function to format time ago
  const getTimeAgo = (date) => {
    if (!date) return '—'
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all registered users (excluding admins)
        const usersSnapshot = await getDocs(collection(db, 'users'))
        const registeredUsers = usersSnapshot.docs.filter(doc => !doc.data().isAdmin)
        const totalMembers = registeredUsers.length

        // Fetch organization-specific stats from database
        const membersSnapshot = await getDocs(collection(db, 'members'))
        const transactionsSnapshot = await getDocs(collection(db, 'transactions'))
        
        // Calculate actual stats
        const specsMembers = membersSnapshot.docs.filter(doc => doc.data().organizationId === 'specs').length
        const imagesMembers = membersSnapshot.docs.filter(doc => doc.data().organizationId === 'images').length
        const elitesMembers = membersSnapshot.docs.filter(doc => doc.data().organizationId === 'elites').length
        
        const totalPayments = transactionsSnapshot.docs
          .filter(doc => doc.data().status === 'completed' && doc.data().type !== 'cash_in')
          .reduce((sum, doc) => sum + (Number(doc.data().amount) || 0), 0)
        
        const pendingPayments = transactionsSnapshot.docs
          .filter(doc => doc.data().status === 'pending')
          .reduce((sum, doc) => sum + (Number(doc.data().amount) || 0), 0)
        
        setStats({
          totalMembers,
          specsMembers,
          imagesMembers,
          elitesMembers,
          totalPayments,
          pendingPayments,
        })

        // Fetch recent activities from real data
        await fetchRecentActivities()
      } catch (err) {
        console.error('Error loading statistics:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    const fetchRecentActivities = async () => {
      try {
        const activities = []

        // Fetch recent members (from members collection, limit 5)
        const recentMembersQuery = query(
          collection(db, 'members'),
          orderBy('createdAt', 'desc'),
          limit(5)
        )
        const recentMembersSnapshot = await getDocs(recentMembersQuery)
        
        recentMembersSnapshot.docs.forEach(doc => {
          const data = doc.data()
          const createdAt = data.createdAt?.toDate?.() || (data.createdAt ? new Date(data.createdAt) : new Date())
          const orgName = data.organizationName || data.organizationId || 'Organization'
          activities.push({
            type: 'member',
            user: data.name || data.userName || 'Unknown',
            action: `Joined ${orgName} organization`,
            time: getTimeAgo(createdAt),
            timestamp: createdAt.getTime(),
          })
        })

        // Fetch recent transactions (payments only, limit 5)
        // Note: Firestore doesn't support != queries with orderBy, so we fetch all and filter
        const allTransactionsSnapshot = await getDocs(query(
          collection(db, 'transactions'),
          orderBy('createdAt', 'desc'),
          limit(20) // Fetch more to filter out cash_ins
        ))
        
        const recentTransactionsSnapshot = {
          docs: allTransactionsSnapshot.docs
            .filter(doc => {
              const data = doc.data()
              return data.type !== 'cash_in' && data.status === 'completed'
            })
            .slice(0, 5)
        }

        // Fetch user names for transactions
        const userIds = [...new Set(recentTransactionsSnapshot.docs.map(doc => doc.data().userId).filter(Boolean))]
        const usersMap = new Map()
        
        for (const userId of userIds) {
          try {
            const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', userId)))
            if (!userDoc.empty) {
              const userData = userDoc.docs[0].data()
              const userName = userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email || 'Unknown'
              usersMap.set(userId, userName)
            }
          } catch (err) {
            console.error('Error fetching user name:', err)
          }
        }

        recentTransactionsSnapshot.docs.forEach(doc => {
          const data = doc.data()
          const createdAt = data.createdAt?.toDate?.() || (data.createdAt ? new Date(data.createdAt) : new Date())
          const userName = usersMap.get(data.userId) || data.userName || data.name || 'Unknown'
          const amount = Number(data.amount) || 0
          
          activities.push({
            type: 'payment',
            user: userName,
            action: `Payment received - ₱${amount.toFixed(0)}`,
            time: getTimeAgo(createdAt),
            timestamp: createdAt.getTime(),
          })
        })

        // Sort all activities by timestamp (most recent first) and limit to 5
        activities.sort((a, b) => b.timestamp - a.timestamp)
        setRecentActivities(activities.slice(0, 5))
      } catch (err) {
        console.error('Error fetching recent activities:', err)
        // Set empty array on error
        setRecentActivities([])
      }
    }

    fetchStats()
  }, [])

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
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-black mb-2">Welcome back, {user?.name?.split(' ')[0] || 'Admin'}! 👋</h2>
            <p className="text-orange-100 text-lg">Here's what's happening with the CCS organizations today.</p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border-l-4 border-blue-500 shadow-sm hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-2">Total Members</p>
              <p className="text-3xl font-black text-slate-900">{stats.totalMembers}</p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border-l-4 border-purple-500 shadow-sm hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-2">Organizations</p>
              <p className="text-3xl font-black text-slate-900">3</p>
              <p className="text-xs text-slate-500 mt-2 font-medium">ELITES, SPECS, IMAGES</p>
            </div>
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border-l-4 border-green-500 shadow-sm hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-2">Total Payments</p>
              <p className="text-3xl font-black text-slate-900">₱{stats.totalPayments.toLocaleString()}</p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border-l-4 border-orange-500 shadow-sm hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-2">Pending Payments</p>
              <p className="text-3xl font-black text-slate-900">₱{stats.pendingPayments.toLocaleString()}</p>
            </div>
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Organization Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-8 border-l-4 border-purple-500 shadow-sm hover:shadow-lg transition-all">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
              🎬
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">SPECS</h3>
              <p className="text-sm text-slate-600 font-medium">BSEMC Organization</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Total Members</span>
              <span className="text-3xl font-black text-purple-600">{stats.specsMembers}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border-l-4 border-green-500 shadow-sm hover:shadow-lg transition-all">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
              🚀
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">IMAGES</h3>
              <p className="text-sm text-slate-600 font-medium">BSCS Organization</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Total Members</span>
              <span className="text-3xl font-black text-green-600">{stats.imagesMembers}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border-l-4 border-blue-500 shadow-sm hover:shadow-lg transition-all">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
              💻
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">ELITES</h3>
              <p className="text-sm text-slate-600 font-medium">BSIT Organization</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Total Members</span>
              <span className="text-3xl font-black text-blue-600">{stats.elitesMembers}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          Recent Activity
        </h3>
        <div className="space-y-4">
          {recentActivities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-slate-500">No recent activity yet</p>
              <p className="text-xs text-slate-400 mt-1">Activities will appear here as students join and make payments</p>
            </div>
          ) : (
            recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  activity.type === 'payment' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {activity.type === 'payment' ? (
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900">{activity.user}</p>
                  <p className="text-sm text-slate-600">{activity.action}</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">{activity.time}</p>
                </div>
              </div>
            ))
          )}
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
