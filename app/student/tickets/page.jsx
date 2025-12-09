'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'

export default function StudentTickets() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({ subject: '', message: '' })

  useEffect(() => {
    if (!user?.uid) {
      setTickets([])
      setLoading(false)
      return
    }

    setLoading(true)

    const q = query(collection(db, 'tickets'), where('userId', '==', user.uid))
    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const ticketsData = snapshot.docs
          .map(doc => {
            const data = doc.data()
            return {
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate?.() || null,
              updatedAt: data.updatedAt?.toDate?.() || null,
              resolvedAt: data.resolvedAt?.toDate?.() || null,
            }
          })
          .sort((a, b) => {
            const aTime = a.createdAt?.getTime() || 0
            const bTime = b.createdAt?.getTime() || 0
            return bTime - aTime
          })

        setTickets(ticketsData)
        setLoading(false)
        setError('')
      },
      err => {
        if (err.code === 'permission-denied' || err.message?.includes('Missing or insufficient permissions')) {
          console.warn('Tickets listener stopped: permission denied (likely due to logout).')
          setTickets([])
          setLoading(false)
          return
        }
        console.error('Error fetching tickets:', err)
        setError('Unable to load tickets. Please refresh the page.')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user?.uid])

  const handleChange = event => {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async event => {
    event.preventDefault()

    if (!formData.subject.trim() || !formData.message.trim()) {
      setError('Please fill in all fields')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const currentUser = auth.currentUser

      if (!currentUser) {
        setError('You are not authenticated with Firebase. Please log out and log in again.')
        return
      }

      const ticketPayload = {
        userId: currentUser.uid,
        name:
          user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : user?.name || currentUser.email,
        email: currentUser.email || '',
        phone: user?.phoneNumber || user?.phone || '',
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        resolvedAt: null,
      }

      await addDoc(collection(db, 'tickets'), ticketPayload)

      setSuccess(true)
      setFormData({ subject: '', message: '' })
      setShowForm(false)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Error submitting ticket:', err)
      if (err.code === 'permission-denied' || err.message?.includes('Missing or insufficient permissions')) {
        setError('Permission denied. Please make sure Firestore rules are published in Firebase Console.')
      } else {
        setError(err.message || 'Failed to submit ticket. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = status => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
    }
    return styles[status] || styles.pending
  }

  const getStatusIcon = status => {
    if (status === 'resolved') {
      return (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
    return (
      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-600 mt-2">Submit concerns and track your requests</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          {showForm ? 'Cancel' : 'New Ticket'}
        </button>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm font-medium text-green-700">
              Ticket submitted successfully! We'll get back to you soon.
            </p>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Create New Ticket</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Brief description of your concern"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                placeholder="Describe your concern in detail..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                disabled={submitting}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Ticket'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setFormData({ subject: '', message: '' })
                  setError('')
                }}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {tickets.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-slate-600 font-medium">No tickets yet</p>
            <p className="text-slate-500 text-sm mt-1">Submit a ticket to get started.</p>
          </div>
        ) : (
          tickets.map(ticket => (
            <div key={ticket.id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-start gap-3">
                {getStatusIcon(ticket.status)}
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-slate-900">{ticket.subject}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    Submitted{' '}
                    {ticket.createdAt?.toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }) || 'N/A'}
                  </p>
                  <p className="text-slate-700 mt-3 whitespace-pre-wrap">{ticket.message}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
