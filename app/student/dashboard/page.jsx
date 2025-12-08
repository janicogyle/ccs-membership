'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  increment,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';

export default function StudentDashboard() {
  const { user } = useAuth();
  const isSimulator = process.env.NEXT_PUBLIC_PAYMONGO_SIMULATOR === 'true';
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCashIn, setShowCashIn] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [cashInAmount, setCashInAmount] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState('elites');
  const [paymentType, setPaymentType] = useState('organization_full');
  const [processing, setProcessing] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const organizations = [
    { name: 'Student Council', program: 'CCS Student Government', status: 'Active', color: 'orange' },
    { name: 'ELITES', program: 'Student Council Extension • BSIT', status: 'Active', color: 'blue' },
    { name: 'SPECS', program: 'Student Council Extension • BSCS', status: 'Inactive', color: 'purple' },
    { name: 'IMAGES', program: 'Student Council Extension • BSEMC', status: 'Inactive', color: 'green' },
  ];

  const organizationOptions = useMemo(
    () => [
      {
        id: 'student_council',
        name: 'Student Council',
        tagline: 'CCS Department Student Government',
        badgeClass: 'bg-emerald-100 text-emerald-700',
        iconEmoji: '🏛️',
      },
      {
        id: 'elites',
        name: 'ELITES',
        tagline: 'Student Council Extension • BSIT',
        badgeClass: 'bg-blue-100 text-blue-700',
        iconEmoji: '💻',
      },
      {
        id: 'specs',
        name: 'SPECS',
        tagline: 'Student Council Extension • BSCS',
        badgeClass: 'bg-purple-100 text-purple-700',
        iconEmoji: '🎬',
      },
      {
        id: 'images',
        name: 'IMAGES',
        tagline: 'Student Council Extension • BSEMC',
        badgeClass: 'bg-green-100 text-green-700',
        iconEmoji: '🚀',
      },
    ],
    []
  );

  const selectedOrganizationMeta = useMemo(
    () => organizationOptions.find((option) => option.id === selectedOrganization) ?? organizationOptions[0],
    [organizationOptions, selectedOrganization]
  );

  const isCouncilSelected = selectedOrganizationMeta?.id === 'student_council';

  const paymentOptions = useMemo(
    () =>
      isCouncilSelected
        ? [
            {
              id: 'council_full',
              label: 'Council Full Payment',
              description: 'Student Council dues - Full year access',
              amount: 60,
              chipClass: 'bg-emerald-100 text-emerald-700',
            },
            {
              id: 'council_half',
              label: 'Council Half Payment',
              description: 'Student Council dues - 1 semester',
              amount: 30,
              chipClass: 'bg-emerald-100 text-emerald-700',
            },
          ]
        : [
            {
              id: 'organization_full',
              label: 'Organization Full Payment',
              description: 'Organization membership - Full year',
              amount: 60,
              chipClass: 'bg-blue-100 text-blue-700',
            },
            {
              id: 'organization_half',
              label: 'Organization Half Payment',
              description: 'Organization membership - 1 semester',
              amount: 30,
              chipClass: 'bg-blue-100 text-blue-700',
            },
          ],
    [isCouncilSelected]
  );

  const selectedPaymentOption = useMemo(
    () => paymentOptions.find((option) => option.id === paymentType) ?? paymentOptions[0],
    [paymentOptions, paymentType]
  );

  const paymentAmount = selectedPaymentOption?.amount ?? 0;
  const organizationDisplayName = selectedOrganizationMeta?.name ?? 'Organization';
  const insufficientBalance = walletBalance < paymentAmount;

  useEffect(() => {
    if (user?.uid) {
      fetchWalletBalance();
    }
  }, [user]);

  useEffect(() => {
    if (!user?.uid) {
      setRecentTransactions([]);
      return;
    }

    const transactionsQuery = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(transactionsQuery, (snapshot) => {
      const items = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        const createdAt = data.createdAt?.toDate?.() ?? (data.createdAt ? new Date(data.createdAt) : null);
        const amountValue = Number(data.amount) || 0;
        const isCashIn = data.type === 'cash_in';
        const dateLabel = createdAt
          ? createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : '—';

        return {
          id: docSnap.id,
          type: data.type || 'payment',
          description: data.description || (isCashIn ? 'Wallet cash-in via PayMongo' : 'Membership payment'),
          date: dateLabel,
          amount: amountValue ? `${isCashIn ? '+' : '-'}₱${amountValue.toFixed(2)}` : null,
        };
      });

      setRecentTransactions(items);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  useEffect(() => {
    const shouldLockScroll = showCashIn || showPayment;
    if (shouldLockScroll) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
    document.body.style.overflow = '';
    return undefined;
  }, [showCashIn, showPayment]);

  useEffect(() => {
    if (!paymentOptions.length) {
      return;
    }
    if (!paymentOptions.some((option) => option.id === paymentType)) {
      setPaymentType(paymentOptions[0].id);
    }
  }, [paymentOptions, paymentType]);

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
      const normalizedAmount = Math.round(amount * 100) / 100;
      const response = await fetch('/api/paymongo/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: normalizedAmount, userId: user.uid }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('PayMongo checkout error:', data);
        alert(data?.error || 'Failed to initialize PayMongo checkout.');
        setProcessing(false);
        return;
      }

      if (!data.checkoutUrl) {
        alert(
          isSimulator
            ? 'The PayMongo simulator did not return a confirmation link. Please try again.'
            : 'PayMongo did not return a checkout link. Please try again.'
        );
        setProcessing(false);
        return;
      }

      setCashInAmount('');
      setProcessing(false);
      setShowCashIn(false);
      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error('Error creating PayMongo checkout session:', error);
      alert('Failed to process payment');
      setProcessing(false);
    }
  };

  const handleMembershipPayment = async () => {
    if (!selectedPaymentOption) {
      alert('Please choose a payment plan.');
      return;
    }

    const isCouncil = selectedPaymentOption.id.startsWith('council');
    const isHalf = selectedPaymentOption.id.endsWith('half');
    const subscriptionType = isCouncil ? 'council' : 'organization';
    const paymentLabel = selectedPaymentOption.label;
    const subscriptionDurationDays = isHalf ? 180 : 365;

    if (walletBalance < paymentAmount) {
      alert('Insufficient balance. Please cash-in first.');
      return;
    }

    if (!confirm(`Confirm ${paymentLabel} for ${organizationDisplayName} amounting to ₱${paymentAmount}?`)) {
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
        organizationId: selectedOrganizationMeta?.id ?? selectedOrganization,
        organizationName: organizationDisplayName,
        paymentType: paymentType,
        description: `${organizationDisplayName} - ${selectedPaymentOption?.label ?? 'Membership payment'}`,
        method: 'Wallet balance',
        amount: paymentAmount,
        status: 'completed',
        createdAt: new Date()
      });

      await addDoc(collection(db, 'subscriptions'), {
        userId: user.uid,
        userName: user.name,
        userEmail: user.email,
        organizationId: selectedOrganizationMeta?.id ?? selectedOrganization,
        organizationName: organizationDisplayName,
        type: subscriptionType,
        paymentType: paymentType,
        amount: paymentAmount,
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + subscriptionDurationDays * 24 * 60 * 60 * 1000),
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
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black mb-2">Dashboard</h1>
            <p className="text-orange-100 text-lg">Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋</p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wallet Card - Orange Gradient */}
        <div className="bg-gradient-to-br from-[#ff6b35] to-[#e85d2c] rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <p className="text-orange-100 text-sm font-semibold mb-2">E-Wallet Balance</p>
            <p className="text-5xl font-black mb-6">₱{walletBalance.toFixed(2)}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCashIn(true)}
                className="px-6 py-2.5 bg-white text-[#ff6b35] rounded-lg font-bold text-sm hover:bg-orange-50 transition-all shadow-lg"
              >
                Cash In
              </button>
              <button
                onClick={() => setShowPayment(true)}
                className="px-6 py-2.5 bg-white/20 text-white rounded-lg font-bold text-sm hover:bg-white/30 transition-all backdrop-blur-sm"
              >
                Make Payment
              </button>
            </div>
          </div>
        </div>

        {/* Cash Card - Red/Orange Gradient */}
        <div className="bg-gradient-to-br from-[#ff8c5a] to-[#ff6b35] rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
          <div className="relative z-10">
            <p className="text-orange-100 text-sm font-semibold mb-2">Cash On Hand</p>
            <p className="text-5xl font-black mb-6">₱CASH 0</p>
            <div className="flex gap-3">
              <button className="px-6 py-2.5 bg-white text-[#ff6b35] rounded-lg font-bold text-sm hover:bg-orange-50 transition-all shadow-lg">
                Manage
              </button>
            </div>
          </div>
        </div>
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
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/85 px-4 py-6 backdrop-blur-sm"
          onClick={() => setShowCashIn(false)}
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
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
              {processing
                ? isSimulator
                  ? 'Completing simulated payment...'
                  : 'Redirecting to PayMongo...'
                : isSimulator
                ? 'Simulate PayMongo Payment'
                : 'Proceed to PayMongo'}
            </button>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/85 px-4 py-6 backdrop-blur-sm"
          onClick={() => setShowPayment(false)}
        >
          <div
            className="bg-white max-h-[calc(100vh-3rem)] w-full max-w-md overflow-y-auto rounded-2xl p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-slate-900">Pay Membership</h3>
              <button onClick={() => setShowPayment(false)} className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              <fieldset className="space-y-3">
                <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-orange-600">Choose Organization</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {organizationOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`relative flex w-full cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition hover:border-orange-300 focus-within:ring-2 focus-within:ring-orange-400 ${
                        selectedOrganization === option.id ? 'border-orange-500 bg-orange-50 shadow-sm' : 'border-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="organization"
                        value={option.id}
                        checked={selectedOrganization === option.id}
                        onChange={() => setSelectedOrganization(option.id)}
                        className="sr-only"
                      />
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-2xl">
                        {option.iconEmoji}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{option.name}</p>
                        <span className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${option.badgeClass}`}>
                          {option.tagline}
                        </span>
                      </div>
                      {selectedOrganization === option.id && (
                        <svg className="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </label>
                  ))}
                </div>
                <p className="text-xs text-slate-500">
                  The Student Council serves as the CCS Student Government. ELITES, SPECS, and IMAGES operate as course-specific extensions of the council.
                </p>
              </fieldset>

              <fieldset className="space-y-3">
                <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-orange-600">Select Payment Plan</legend>
                <div className="space-y-3">
                  {paymentOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`flex w-full cursor-pointer flex-col gap-3 rounded-xl border-2 p-4 transition hover:border-orange-300 focus-within:ring-2 focus-within:ring-orange-400 ${
                        paymentType === option.id ? 'border-orange-500 bg-orange-50 shadow-sm' : 'border-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentPlan"
                        value={option.id}
                        checked={paymentType === option.id}
                        onChange={() => setPaymentType(option.id)}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-900">{option.label}</p>
                          <p className="text-sm text-slate-600">{option.description}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${option.chipClass}`}>
                          ₱{option.amount.toFixed(2)}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-600">Paying For</span>
                  <span className="font-semibold text-slate-900">{organizationDisplayName}</span>
                </div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-600">Current Balance</span>
                  <span className="font-semibold text-slate-900">₱{walletBalance.toFixed(2)}</span>
                </div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-600">Payment Amount</span>
                  <span className="font-semibold text-slate-900">-₱{paymentAmount.toFixed(2)}</span>
                </div>
                <div className="mt-2 flex justify-between border-t border-slate-200 pt-2">
                  <span className="font-semibold text-slate-900">Remaining Balance</span>
                  <span className="font-bold text-slate-900">₱{(walletBalance - paymentAmount).toFixed(2)}</span>
                </div>
              </div>

              {insufficientBalance && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                  <span className="font-semibold">Insufficient balance.</span> Please cash-in first.
                </div>
              )}

              <button
                onClick={handleMembershipPayment}
                disabled={processing || insufficientBalance}
                className="w-full rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processing ? 'Processing...' : `Confirm ${selectedPaymentOption?.label ?? 'Payment'}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 - Orange */}
        <div className="bg-white p-6 rounded-2xl border-l-4 border-orange-500 shadow-sm hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-2">Active Organizations</p>
              <h3 className="text-3xl font-black text-slate-900">3</h3>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 2 - Blue */}
        <div className="bg-white p-6 rounded-2xl border-l-4 border-blue-500 shadow-sm hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-2">Total Payments</p>
              <h3 className="text-3xl font-black text-slate-900">₱850</h3>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 3 - Green */}
        <div className="bg-white p-6 rounded-2xl border-l-4 border-green-500 shadow-sm hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-2">Membership Status</p>
              <h3 className="text-3xl font-black text-green-600">Active</h3>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 4 - Purple */}
        <div className="bg-white p-6 rounded-2xl border-l-4 border-purple-500 shadow-sm hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-2">Recent Transactions</p>
              <h3 className="text-3xl font-black text-slate-900">12</h3>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Organizations */}
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
          <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            Your Organizations
          </h3>
          <div className="space-y-4">
            {organizations.map((org, index) => {
              const colorMap = {
                blue: { bg: 'bg-blue-500', lightBg: 'bg-blue-100', icon: '💻' },
                purple: { bg: 'bg-purple-500', lightBg: 'bg-purple-100', icon: '🎬' },
                green: { bg: 'bg-green-500', lightBg: 'bg-green-100', icon: '🚀' },
                orange: { bg: 'bg-orange-500', lightBg: 'bg-orange-100', icon: '🏛️' }
              };
              const colors = colorMap[org.color];
              
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-5 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 ${colors.lightBg} rounded-xl flex items-center justify-center text-2xl`}>
                      {colors.icon}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-lg">{org.name}</p>
                      <p className="text-sm text-slate-500">{org.program}</p>
                    </div>
                  </div>
                  <span
                    className={`
                      px-4 py-2 rounded-lg text-xs font-bold
                      ${org.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}
                    `}
                  >
                    {org.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
          <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <p className="text-sm text-slate-500">No recent activity yet. Complete a cash-in or payment to see it here.</p>
            ) : (
              recentTransactions.map((activity) => {
                const isCashIn = activity.type === 'cash_in';
                return (
                  <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isCashIn ? 'bg-green-100' : 'bg-blue-100'
                      }`}
                    >
                      {isCashIn ? (
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5v2a3 3 0 01-3 3H3m6-5h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2v-4" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900">{activity.description}</p>
                      <p className="text-xs text-slate-500 mt-1">{activity.date}</p>
                    </div>
                    {activity.amount && (
                      <span className={`text-sm font-black ${isCashIn ? 'text-green-600' : 'text-slate-900'}`}>
                        {activity.amount}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
