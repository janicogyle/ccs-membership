/**
 * Firestore Collections Verification Tool
 * 
 * This page verifies all required Firestore collections are accessible
 * and provides real-time status of your database setup.
 * 
 * Access this at: http://localhost:3000/verify-firestore
 */

'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, query, limit, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'

export default function VerifyFirestore() {
  const { user } = useAuth()
  const [status, setStatus] = useState({
    users: { exists: false, count: 0, accessible: false, error: null },
    wallets: { exists: false, count: 0, accessible: false, error: null },
    transactions: { exists: false, count: 0, accessible: false, error: null },
    subscriptions: { exists: false, count: 0, accessible: false, error: null },
    tickets: { exists: false, count: 0, accessible: false, error: null },
  })
  const [loading, setLoading] = useState(true)
  const [testResults, setTestResults] = useState([])

  useEffect(() => {
    if (user) {
      verifyCollections()
    }
  }, [user])

  const addLog = (message, type = 'info') => {
    setTestResults(prev => [...prev, { message, type, time: new Date().toLocaleTimeString() }])
  }

  const verifyCollection = async (collectionName) => {
    try {
      addLog(`Checking ${collectionName} collection...`, 'info')
      const collectionRef = collection(db, collectionName)
      const q = query(collectionRef, limit(10))
      const snapshot = await getDocs(q)
      
      addLog(`✅ ${collectionName}: ${snapshot.size} documents found`, 'success')
      
      return {
        exists: true,
        count: snapshot.size,
        accessible: true,
        error: null
      }
    } catch (error) {
      addLog(`❌ ${collectionName}: ${error.message}`, 'error')
      return {
        exists: false,
        count: 0,
        accessible: false,
        error: error.message
      }
    }
  }

  const verifyCollections = async () => {
    setLoading(true)
    setTestResults([])
    addLog('🚀 Starting Firestore verification...', 'info')
    addLog(`👤 Authenticated as: ${user.email}`, 'info')

    const collections = ['users', 'wallets', 'transactions', 'subscriptions', 'tickets']
    const results = {}

    for (const collectionName of collections) {
      results[collectionName] = await verifyCollection(collectionName)
      await new Promise(resolve => setTimeout(resolve, 500)) // Small delay for readability
    }

    setStatus(results)
    setLoading(false)
    addLog('✨ Verification complete!', 'success')
  }

  const testCreateDocument = async (collectionName) => {
    if (!user) {
      addLog('❌ Must be logged in to test document creation', 'error')
      return
    }

    try {
      addLog(`Creating test document in ${collectionName}...`, 'info')
      
      let testDoc = {}
      switch (collectionName) {
        case 'tickets':
          testDoc = {
            userId: user.uid,
            name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email,
            email: user.email,
            subject: 'Test Ticket - Firestore Verification',
            message: 'This is a test ticket created during Firestore verification.',
            status: 'pending',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }
          break
        
        case 'transactions':
          testDoc = {
            userId: user.uid,
            type: 'test',
            amount: 0,
            description: 'Test transaction for verification',
            status: 'completed',
            timestamp: serverTimestamp(),
          }
          break
        
        default:
          addLog(`❌ Test creation not configured for ${collectionName}`, 'error')
          return
      }

      const docRef = await addDoc(collection(db, collectionName), testDoc)
      addLog(`✅ Test document created successfully with ID: ${docRef.id}`, 'success')
      
      // Refresh collection status
      const updatedStatus = await verifyCollection(collectionName)
      setStatus(prev => ({ ...prev, [collectionName]: updatedStatus }))
      
    } catch (error) {
      addLog(`❌ Failed to create test document: ${error.message}`, 'error')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Authentication Required</h1>
          <p className="text-slate-600 mb-6">Please log in to verify Firestore collections</p>
          <a 
            href="/auth/login" 
            className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
          >
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-8 text-white mb-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-2">🔍 Firestore Collections Verification</h1>
          <p className="text-orange-100">Real-time status of your Firebase Firestore database</p>
          <p className="text-sm text-orange-100 mt-2">Project: ccs-membership-6dbc9</p>
        </div>

        {/* Collections Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Object.entries(status).map(([name, info]) => (
            <div key={name} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 capitalize">{name}</h3>
                {info.accessible ? (
                  <span className="text-2xl">✅</span>
                ) : (
                  <span className="text-2xl">❌</span>
                )}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Status:</span>
                  <span className={info.accessible ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                    {info.accessible ? 'Accessible' : 'Error'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Documents:</span>
                  <span className="text-slate-900 font-medium">{info.count}</span>
                </div>
                {info.error && (
                  <div className="mt-2 p-2 bg-red-50 rounded text-red-600 text-xs">
                    {info.error}
                  </div>
                )}
              </div>

              {info.accessible && (name === 'tickets' || name === 'transactions') && (
                <button
                  onClick={() => testCreateDocument(name)}
                  className="mt-4 w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm font-medium"
                >
                  Test Create
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={verifyCollections}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
            >
              {loading ? '🔄 Verifying...' : '🔄 Re-verify Collections'}
            </button>
            <a
              href="/student/dashboard"
              className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition font-medium"
            >
              Go to Dashboard
            </a>
            <a
              href="/"
              className="px-6 py-3 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition font-medium"
            >
              Back to Home
            </a>
          </div>
        </div>

        {/* Live Log */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-800 px-6 py-4 text-white font-semibold">
            📋 Verification Log
          </div>
          <div className="p-6 bg-slate-900 text-slate-100 font-mono text-sm max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <div className="text-slate-400">No logs yet. Click "Re-verify Collections" to start.</div>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="mb-1">
                  <span className="text-slate-500">[{result.time}]</span>{' '}
                  <span className={
                    result.type === 'success' ? 'text-green-400' :
                    result.type === 'error' ? 'text-red-400' :
                    'text-blue-400'
                  }>
                    {result.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Collection Details */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4">📚 Collection Descriptions</h2>
          <div className="space-y-3 text-sm">
            <div>
              <strong className="text-slate-900">users:</strong>
              <span className="text-slate-600"> User profiles and authentication data</span>
            </div>
            <div>
              <strong className="text-slate-900">wallets:</strong>
              <span className="text-slate-600"> User wallet balances</span>
            </div>
            <div>
              <strong className="text-slate-900">transactions:</strong>
              <span className="text-slate-600"> Payment and wallet transaction history</span>
            </div>
            <div>
              <strong className="text-slate-900">subscriptions:</strong>
              <span className="text-slate-600"> Organization and council memberships</span>
            </div>
            <div>
              <strong className="text-slate-900">tickets:</strong>
              <span className="text-slate-600"> Support tickets and help requests</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
