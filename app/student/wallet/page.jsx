'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function StudentWallet() {
  const { user } = useAuth()
  const [walletBalance, setWalletBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showCashIn, setShowCashIn] = useState(false)
  const [showSubscribe, setShowSubscribe] = useState(false)
  const [cashInAmount, setCashInAmount] = useState('')
  const [processing, setProcessing] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (user?.uid) {
      fetchWallet()
      fetchTransactions()
    }
  }, [user])

  const fetchWallet = async () => {
    try {
      const walletDoc = await getDoc(doc(db, 'wallets', user.uid))
      if (walletDoc.exists()) {
        setWalletBalance(walletDoc.data().balance || 0)
      } else {
        // Create wallet if doesn't exist
        await setDoc(doc(db, 'wallets', user.uid), {
          userId: user.uid,
          balance: 0,
          createdAt: new Date(),
        })
      }
    } catch (err) {
      console.error('Error fetching wallet:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchTransactions = async () => {
    try {
      const transactionsQuery = query(
        collection(db, 'transactions'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      )
      const transactionsSnapshot = await getDocs(transactionsQuery)
      const transactionsData = transactionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      }))
      setTransactions(transactionsData)
    } catch (err) {
      console.error('Error fetching transactions:', err)
    }
  }

  const handleCashIn = async () => {
    const amount = parseFloat(cashInAmount)
    
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (amount < 100) {
      setError('Minimum cash-in amount is ₱100')
      return
    }

    try {
      setProcessing(true)
      setError('')

      // In production, integrate with PayMongo API here
      // For now, simulate payment
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Update wallet balance
      const newBalance = walletBalance + amount
      await updateDoc(doc(db, 'wallets', user.uid), {
        balance: newBalance,
        updatedAt: new Date(),
      })

      // Record transaction
      await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        type: 'cash_in',
        amount: amount,
        status: 'completed',
        method: 'paymongo',
        createdAt: new Date(),
      })

      setWalletBalance(newBalance)
      setSuccess(`Successfully added ₱${amount.toFixed(2)} to your wallet!`)
      setCashInAmount('')
      setShowCashIn(false)
      fetchTransactions()
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error processing cash-in:', err)
      setError('Failed to process payment. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const handleSubscribe = async (type, amount) => {
    if (walletBalance < amount) {
      setError(`Insufficient balance. You need ₱${(amount - walletBalance).toFixed(2)} more.`)
      return
    }

    try {
      setProcessing(true)
      setError('')

      // Deduct from wallet
      const newBalance = walletBalance - amount
      await updateDoc(doc(db, 'wallets', user.uid), {
        balance: newBalance,
        updatedAt: new Date(),
      })

      // Record transaction
      await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        type: 'subscription',
        subscriptionType: type,
        amount: amount,
        status: 'completed',
        createdAt: new Date(),
      })

      // Record subscription
      await addDoc(collection(db, 'subscriptions'), {
        userId: user.uid,
        userName: user.name,
        userEmail: user.email,
        type: type,
        amount: amount,
        status: 'active',
        createdAt: new Date(),
      })

      setWalletBalance(newBalance)
      setSuccess(`Successfully subscribed to ${type} membership!`)
      setShowSubscribe(false)
      fetchTransactions()
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error processing subscription:', err)
      setError('Failed to process subscription. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const getTransactionIcon = (type) => {
    if (type === 'cash_in') {
      return (
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      )
    }
    return (
      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Wallet</h1>
        <p className="text-gray-600 mt-2">Manage your balance and subscriptions</p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm font-medium text-green-700">{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-orange-100 text-sm font-medium mb-2">Available Balance</p>
            <h2 className="text-5xl font-bold">₱{walletBalance.toFixed(2)}</h2>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowCashIn(true)}
            className="flex-1 bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors"
          >
            Cash In
          </button>
          <button
            onClick={() => setShowSubscribe(true)}
            className="flex-1 bg-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors"
          >
            Subscribe
          </button>
        </div>
      </div>

      {/* Cash In Modal */}
      {showCashIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Cash In</h3>
              <button
                onClick={() => {
                  setShowCashIn(false)
                  setCashInAmount('')
                  setError('')
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Amount (₱)
                </label>
                <input
                  type="number"
                  value={cashInAmount}
                  onChange={(e) => setCashInAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="100"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-slate-900"
                  disabled={processing}
                />
                <p className="text-xs text-slate-500 mt-1">Minimum amount: ₱100</p>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-2">Quick amounts:</p>
                <div className="grid grid-cols-4 gap-2">
                  {[100, 200, 500, 1000].map(amount => (
                    <button
                      key={amount}
                      onClick={() => setCashInAmount(amount.toString())}
                      className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:border-orange-500 hover:text-orange-600 transition-colors"
                      disabled={processing}
                    >
                      ₱{amount}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCashIn}
                disabled={processing}
                className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing...' : 'Proceed to Payment'}
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secured by PayMongo</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subscribe Modal */}
      {showSubscribe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Subscribe to Membership</h3>
              <button
                onClick={() => {
                  setShowSubscribe(false)
                  setError('')
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Half Payment */}
              <div className="border-2 border-slate-200 rounded-xl p-6 hover:border-orange-500 transition-colors">
                <div className="text-center mb-4">
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Half Payment</h4>
                  <div className="text-4xl font-bold text-orange-600 mb-1">₱250</div>
                  <p className="text-sm text-slate-600">Pay 50% now</p>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Access to organization
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Partial benefits
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Balance due later
                  </li>
                </ul>
                <button
                  onClick={() => handleSubscribe('Half Payment', 250)}
                  disabled={processing}
                  className="w-full px-6 py-3 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Subscribe
                </button>
              </div>

              {/* Full Payment */}
              <div className="border-2 border-orange-500 rounded-xl p-6 bg-orange-50">
                <div className="text-center mb-4">
                  <div className="inline-block px-3 py-1 bg-orange-600 text-white text-xs font-semibold rounded-full mb-2">
                    RECOMMENDED
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Full Payment</h4>
                  <div className="text-4xl font-bold text-orange-600 mb-1">₱500</div>
                  <p className="text-sm text-slate-600">One-time payment</p>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Full access to organization
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    All benefits included
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    No balance due
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Priority support
                  </li>
                </ul>
                <button
                  onClick={() => handleSubscribe('Full Payment', 500)}
                  disabled={processing}
                  className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Subscribe
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-blue-900">Your current balance: ₱{walletBalance.toFixed(2)}</p>
                  <p className="text-sm text-blue-800 mt-1">
                    {walletBalance < 250 && "You need to cash in before subscribing."}
                    {walletBalance >= 250 && walletBalance < 500 && "You have enough for half payment."}
                    {walletBalance >= 500 && "You have enough for full payment!"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Transaction History</h2>

        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-slate-600 font-medium">No transactions yet</p>
            <p className="text-slate-500 text-sm mt-1">Your transaction history will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <p className="font-semibold text-slate-900">
                      {transaction.type === 'cash_in' ? 'Cash In' : `Subscription - ${transaction.subscriptionType}`}
                    </p>
                    <p className="text-sm text-slate-500">
                      {transaction.createdAt?.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${transaction.type === 'cash_in' ? 'text-green-600' : 'text-orange-600'}`}>
                    {transaction.type === 'cash_in' ? '+' : '-'}₱{transaction.amount.toFixed(2)}
                  </p>
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
