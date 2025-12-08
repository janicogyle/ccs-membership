'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, increment } from 'firebase/firestore';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCashIn, setShowCashIn] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [cashInAmount, setCashInAmount] = useState('');
  const [paymentType, setPaymentType] = useState('half');
  const [processing, setProcessing] = useState(false);

  const organizations = [
    { name: 'ELITES', program: 'BSIT', status: 'Active', color: 'blue' },
    { name: 'IMAGES', program: 'BSEMC', status: 'Inactive', color: 'purple' },
    { name: 'SPECS', program: 'BSCS', status: 'Inactive', color: 'green' },
  ];

  const recentActivities = [
    { type: 'payment', description: 'Membership fee payment', date: 'Dec 7, 2025', amount: '₱350' },
    { type: 'membership', description: 'Joined ELITES organization', date: 'Dec 5, 2025', amount: null },
    { type: 'payment', description: 'Semester dues payment', date: 'Dec 1, 2025', amount: '₱500' },
  ];

  useEffect(() => {
    if (user?.uid) {
      fetchWalletBalance();
    }
  }, [user]);

  const fetchWalletBalance = async () => {
    try {
      const walletRef = doc(db, 'wallets', user.uid);
      const walletSnap = await getDoc(walletRef);
      
      if (walletSnap.exists()) {
        setWalletBalance(walletSnap.data().balance || 0);
      } else {
        // Create wallet document if it doesn't exist
        await setDoc(walletRef, {
          userId: user.uid,
          balance: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        setWalletBalance(0);
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCashIn = async () => {
    const amount = parseFloat(cashInAmount);
    
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (amount < 100) {
      alert('Minimum cash-in amount is ₱100');
      return;
    }

    setProcessing(true);
    try {
      // Simulate payment with confirmation dialog (no external link for demo)
      const confirmed = confirm(`Simulate payment of ₱${amount}?\n\nThis is a demo - no actual payment will be processed.`);
      
      if (!confirmed) {
        setProcessing(false);
        return;
      }
      
      // Simulate payment success
      setTimeout(async () => {
        const walletRef = doc(db, 'wallets', user.uid);
        const walletSnap = await getDoc(walletRef);
        
        if (!walletSnap.exists()) {
          await setDoc(walletRef, {
            userId: user.uid,
            balance: amount,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        } else {
          await updateDoc(walletRef, {
            balance: increment(amount),
            updatedAt: new Date()
          });
        }

        await addDoc(collection(db, 'transactions'), {
          userId: user.uid,
          type: 'cash_in',
          amount: amount,
          status: 'completed',
          method: 'paymongo_simulation',
          createdAt: new Date()
        });

        await fetchWalletBalance();
        setCashInAmount('');
        setShowCashIn(false);
        alert('Cash-in successful! ₱' + amount + ' added to your wallet.');
        setProcessing(false);
      }, 3000);
    } catch (error) {
      console.error('Error processing cash-in:', error);
      alert('Failed to process payment');
      setProcessing(false);
    }
  };

  const handleMembershipPayment = async () => {
    const paymentAmount = (paymentType === 'half' || paymentType === 'council_half') ? 30 : 60;
    const isCouncil = paymentType.startsWith('council_');
    const isHalf = paymentType === 'half' || paymentType === 'council_half';
    
    let paymentLabel = '';
    if (paymentType === 'half') paymentLabel = 'Organization Half Payment';
    else if (paymentType === 'full') paymentLabel = 'Organization Full Payment';
    else if (paymentType === 'council_half') paymentLabel = 'Council Half Payment';
    else if (paymentType === 'council_full') paymentLabel = 'Council Full Payment';
    
    const subscriptionType = isCouncil ? 'council' : 'organization';
    
    if (walletBalance < paymentAmount) {
      alert('Insufficient balance. Please cash-in first.');
      return;
    }

    if (!confirm(`Confirm ${paymentLabel} of ₱${paymentAmount}?`)) {
      return;
    }

    setProcessing(true);
    try {
      const walletRef = doc(db, 'wallets', user.uid);
      const walletSnap = await getDoc(walletRef);
      
      if (!walletSnap.exists()) {
        throw new Error('Wallet not found. Please refresh the page.');
      }
      
      await updateDoc(walletRef, {
        balance: increment(-paymentAmount),
        updatedAt: new Date()
      });

      await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        type: 'subscription',
        subscriptionType: subscriptionType,
        paymentType: paymentType,
        amount: paymentAmount,
        status: 'completed',
        createdAt: new Date()
      });

      await addDoc(collection(db, 'subscriptions'), {
        userId: user.uid,
        userName: user.name,
        userEmail: user.email,
        type: subscriptionType,
        paymentType: paymentType,
        amount: paymentAmount,
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + (isHalf ? 180 : 365) * 24 * 60 * 60 * 1000),
        createdAt: new Date()
      });

      await fetchWalletBalance();
      setShowPayment(false);
      alert('Payment successful!');
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Failed to process payment');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0] || 'Student'}!</h2>
        <p className="text-orange-100">Manage your wallet and membership payments.</p>
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-orange-100 text-sm mb-3">Available Balance</p>
            <h2 className="text-5xl font-bold">₱{walletBalance.toFixed(2)}</h2>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowCashIn(true)}
            className="flex-1 bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors"
          >
            Cash In via PayMongo
          </button>
          <button
            onClick={() => setShowPayment(true)}
            className="flex-1 bg-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors"
          >
            Pay Membership
          </button>
        </div>
      </div>

      {/* Cash In Modal */}
      {showCashIn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCashIn(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-slate-900">Cash In via PayMongo</h3>
              <button onClick={() => setShowCashIn(false)} className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Amount (₱)</label>
              <input
                type="number"
                value={cashInAmount}
                onChange={(e) => setCashInAmount(e.target.value)}
                placeholder="Enter amount (min ₱100)"
                min="100"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-900"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Secure Payment:</span> You'll be redirected to PayMongo's secure payment page to complete your transaction.
              </p>
            </div>

            <button
              onClick={handleCashIn}
              disabled={processing}
              className="w-full px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              {processing ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPayment(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-slate-900">Pay Membership</h3>
              <button onClick={() => setShowPayment(false)} className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-4 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-orange-300 has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50">
                <input
                  type="radio"
                  name="payment"
                  value="half"
                  checked={paymentType === 'half'}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="w-4 h-4 text-orange-600"
                />
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">Half Payment - ₱30</p>
                  <p className="text-sm text-slate-600">Organization - 1 semester</p>
                </div>
              </label>

              <label className="flex items-center gap-4 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-orange-300 has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50">
                <input
                  type="radio"
                  name="payment"
                  value="full"
                  checked={paymentType === 'full'}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="w-4 h-4 text-orange-600"
                />
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">Full Payment - ₱60</p>
                  <p className="text-sm text-slate-600">Organization - Full year</p>
                </div>
              </label>

              <label className="flex items-center gap-4 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-purple-300 has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50">
                <input
                  type="radio"
                  name="payment"
                  value="council_half"
                  checked={paymentType === 'council_half'}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="w-4 h-4 text-purple-600"
                />
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">Council Half - ₱30</p>
                  <p className="text-sm text-slate-600">Council - 1 semester</p>
                </div>
              </label>

              <label className="flex items-center gap-4 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-purple-300 has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50">
                <input
                  type="radio"
                  name="payment"
                  value="council_full"
                  checked={paymentType === 'council_full'}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="w-4 h-4 text-purple-600"
                />
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">Council Full - ₱60</p>
                  <p className="text-sm text-slate-600">Council - Full year</p>
                </div>
              </label>
            </div>

            <div className="bg-slate-100 rounded-xl p-4 mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">Current Balance</span>
                <span className="font-semibold text-slate-900">₱{walletBalance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">Payment Amount</span>
                <span className="font-semibold text-slate-900">-₱{(paymentType === 'half' || paymentType === 'council_half') ? '30.00' : '60.00'}</span>
              </div>
              <div className="border-t border-slate-300 pt-2 mt-2 flex justify-between">
                <span className="font-semibold text-slate-900">Remaining Balance</span>
                <span className="font-bold text-slate-900">₱{(walletBalance - ((paymentType === 'half' || paymentType === 'council_half') ? 30 : 60)).toFixed(2)}</span>
              </div>
            </div>

            {walletBalance < ((paymentType === 'half' || paymentType === 'council_half') ? 30 : 60) && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-red-800">
                  <span className="font-semibold">Insufficient balance.</span> Please cash-in first.
                </p>
              </div>
            )}

            <button
              onClick={handleMembershipPayment}
              disabled={processing || walletBalance < ((paymentType === 'half' || paymentType === 'council_half') ? 30 : 60)}
              className="w-full px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              {processing ? 'Processing...' : 'Confirm Payment'}
            </button>
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Organizations */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-5">Your Organizations</h3>
          <div className="space-y-3">
            {organizations.map((org, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-${org.color}-100 rounded-lg flex items-center justify-center`}>
                    <span className={`text-${org.color}-600 font-bold text-sm`}>{org.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{org.name}</p>
                    <p className="text-sm text-slate-500">{org.program}</p>
                  </div>
                </div>
                <span
                  className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    ${org.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}
                  `}
                >
                  {org.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-5">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  activity.type === 'payment' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  {activity.type === 'payment' ? (
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{activity.description}</p>
                  <p className="text-xs text-slate-500 mt-1">{activity.date}</p>
                </div>
                {activity.amount && (
                  <span className="text-sm font-semibold text-slate-900">{activity.amount}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
