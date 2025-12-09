'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { collection, query, getDocs, doc, updateDoc, orderBy, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function AdminTickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, pending, resolved
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    if (user?.uid) {
      fetchTickets()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid])

  const fetchTickets = async () => {
    if (!user?.uid) return
    try {
      setLoading(true)
      setError('')
      
      const ticketsRef = collection(db, 'tickets')
      const q = query(ticketsRef, orderBy('createdAt', 'desc'))
      
      const snapshot = await getDocs(q)
      const ticketsData = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || null,
        updatedAt: docSnap.data().updatedAt?.toDate() || null,
        resolvedAt: docSnap.data().resolvedAt?.toDate() || null,
      }))

      setTickets(ticketsData)
    } catch (err) {
      console.error('Error fetching tickets:', err)
      setError(err.message || 'Unable to load tickets. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const updateTicketStatus = async (ticketId, status) => {
    if (!user?.uid) {
      setError('Authentication required. Please log in again.')
      return
    }
    try {
      setError('')
      
      const ticketRef = doc(db, 'tickets', ticketId)
      const updateData = {
        status,
        updatedAt: serverTimestamp(),
      }
      
      if (status === 'resolved') {
        updateData.resolvedAt = serverTimestamp()
      }
      
      await updateDoc(ticketRef, updateData)

      const updatedTicket = {
        ...tickets.find(t => t.id === ticketId),
        status,
        updatedAt: new Date(),
        resolvedAt: status === 'resolved' ? new Date() : null,
      }

      setTickets(prev => prev.map(ticket => (ticket.id === ticketId ? updatedTicket : ticket)))

      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(updatedTicket)
      }
    } catch (err) {
      console.error('Error updating ticket:', err)
      setError('Unable to update ticket status. Please try again.')
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true
    return ticket.status === filter
  })

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
    }
    return styles[status] || styles.pending
  }

  const getStatusIcon = (status) => {
    if (status === 'resolved') {
      return (
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
    return (
      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-600 mt-2">Manage student inquiries and concerns</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold">
            {tickets.filter(t => t.status === 'pending').length} Pending
          </span>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-3 font-medium transition-colors ${
            filter === 'all'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All ({tickets.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-6 py-3 font-medium transition-colors ${
            filter === 'pending'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Pending ({tickets.filter(t => t.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('resolved')}
          className={`px-6 py-3 font-medium transition-colors ${
            filter === 'resolved'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Resolved ({tickets.filter(t => t.status === 'resolved').length})
        </button>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-slate-600 font-medium">No tickets found</p>
            <p className="text-slate-500 text-sm mt-1">
              {filter === 'pending' ? 'All tickets have been resolved' : 'Tickets will appear here when students submit inquiries'}
            </p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedTicket(ticket)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  {getStatusIcon(ticket.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-900">{ticket.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-1">{ticket.email}</p>
                    {ticket.phone && (
                      <p className="text-sm text-slate-600 mb-3">📱 {ticket.phone}</p>
                    )}
                    <p className="text-slate-700 mt-3 line-clamp-2">{ticket.message}</p>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-xs text-slate-500">
                    {ticket.createdAt?.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-slate-400">
                    {ticket.createdAt?.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              
              {ticket.status === 'pending' && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      updateTicketStatus(ticket.id, 'resolved')
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                  >
                    Mark as Resolved
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedTicket(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Ticket Details</h2>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <label className="text-sm font-semibold text-slate-700">Status</label>
                <div className="mt-2">
                  <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${getStatusBadge(selectedTicket.status)}`}>
                    {selectedTicket.status}
                  </span>
                </div>
              </div>

              {/* Student Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Name</label>
                  <p className="mt-1 text-slate-900">{selectedTicket.name}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Email</label>
                  <p className="mt-1 text-slate-900">{selectedTicket.email}</p>
                </div>
                {selectedTicket.phone && (
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Phone</label>
                    <p className="mt-1 text-slate-900">{selectedTicket.phone}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-semibold text-slate-700">Submitted</label>
                  <p className="mt-1 text-slate-900">
                    {selectedTicket.createdAt?.toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-sm font-semibold text-slate-700">Message</label>
                <div className="mt-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-slate-900 whitespace-pre-wrap">{selectedTicket.message}</p>
                </div>
              </div>

              {/* Actions */}
              {selectedTicket.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => {
                      updateTicketStatus(selectedTicket.id, 'resolved')
                    }}
                    className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                  >
                    Mark as Resolved
                  </button>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
