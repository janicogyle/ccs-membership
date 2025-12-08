'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'

export default function StudentMembers() {
  const { user } = useAuth()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [userProgram, setUserProgram] = useState('')

  useEffect(() => {
    if (user?.uid) {
      fetchUserProgram()
    }
  }, [user])

  const fetchUserProgram = async () => {
    try {
      setLoading(true)
      // Get current user's program from Firestore
      const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', user.uid)))
      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data()
        const program = userData.program
        setUserProgram(program)
        
        // Fetch members with same program only
        await fetchMembers(program)
      }
    } catch (err) {
      console.error('Error fetching user program:', err)
      setLoading(false)
    }
  }

  const fetchMembers = async (program) => {
    try {
      // Query users with same program, excluding admins
      const membersQuery = query(
        collection(db, 'users'),
        where('program', '==', program),
        orderBy('createdAt', 'desc')
      )
      const membersSnapshot = await getDocs(membersQuery)
      
      const membersData = membersSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        }))
        .filter(member => !member.isAdmin) // Exclude admins
      
      setMembers(membersData)
    } catch (err) {
      console.error('Error fetching members:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.block?.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesSearch
  })

  const getOrganizationColor = (program) => {
    const colors = {
      'BSEMC': 'bg-purple-100 text-purple-800 border-purple-200',
      'BSCS': 'bg-green-100 text-green-800 border-green-200',
      'BSIT': 'bg-blue-100 text-blue-800 border-blue-200',
    }
    return colors[program] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getOrganizationName = (program) => {
    const names = {
      'BSEMC': 'IMAGES',
      'BSCS': 'SPECS',
      'BSIT': 'ELITES',
    }
    return names[program] || program
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {getOrganizationName(userProgram)} Members
        </h1>
        <p className="text-gray-600 mt-2">View all members in your organization</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Search Members
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or block..."
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
          />
          <svg
            className="absolute left-3 top-3.5 w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
            userProgram === 'BSEMC' ? 'bg-purple-100' :
            userProgram === 'BSCS' ? 'bg-green-100' :
            userProgram === 'BSIT' ? 'bg-blue-100' : 'bg-orange-100'
          }`}>
            <span className={`text-3xl font-bold ${
              userProgram === 'BSEMC' ? 'text-purple-600' :
              userProgram === 'BSCS' ? 'text-green-600' :
              userProgram === 'BSIT' ? 'text-blue-600' : 'text-orange-600'
            }`}>
              {getOrganizationName(userProgram)?.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900">
              {getOrganizationName(userProgram)}
            </h2>
            <p className="text-slate-600">{userProgram} Organization</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-slate-900">{members.length}</p>
            <p className="text-sm text-slate-600">Total Members</p>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">
            {filteredMembers.length} {filteredMembers.length === 1 ? 'Member' : 'Members'}
          </h2>
        </div>

        {filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-slate-600 font-medium">No members found</p>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="px-6 py-5 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="text-white font-bold text-lg">
                        {member.name?.charAt(0) || 'M'}
                      </span>
                    </div>

                    {/* Member Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 truncate">
                        {member.name || 'Unknown'}
                      </h3>
                      <p className="text-sm text-slate-600 truncate">{member.email}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getOrganizationColor(member.program)}`}>
                          {getOrganizationName(member.program)}
                        </span>
                        {member.year && (
                          <span className="text-xs text-slate-500 font-medium">
                            {member.year} • Block {member.block}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Join Date */}
                  <div className="text-right ml-4">
                    <p className="text-xs text-slate-500">Member since</p>
                    <p className="text-sm font-medium text-slate-900">
                      {member.createdAt?.toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
