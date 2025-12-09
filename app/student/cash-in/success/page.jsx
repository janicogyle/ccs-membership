'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function CashInSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [status, setStatus] = useState('pending');
  const [message, setMessage] = useState('Processing your payment...');
  const [details, setDetails] = useState(null);
  const processedRef = useRef(false);
  const redirectRef = useRef(false);

  useEffect(() => {
    const sessionId = searchParams.get('checkout_session_id');
    const amountParam = searchParams.get('amount');

    if (!sessionId) {
      setStatus('error');
      setMessage('Missing payment session information.');
      return;
    }

    // Wait for auth to be ready and user to be available
    if (isLoading) {
      setMessage('Loading authentication...');
      return;
    }

    if (!user?.uid) {
      setStatus('error');
      setMessage('Please log in to complete your cash-in. Your payment will be processed once you log in.');
      return;
    }

    // Prevent double processing
    if (processedRef.current) {
      return;
    }
    processedRef.current = true;

    const processSimulatedPayment = async () => {
      try {
        setMessage('Processing your payment...');
        
        // First check if this session was already processed
        const existingTxQuery = query(
          collection(db, 'transactions'),
          where('checkoutSessionId', '==', sessionId),
          where('userId', '==', user.uid)
        );
        const existingTxSnap = await getDocs(existingTxQuery);

        if (!existingTxSnap.empty) {
          const existingTx = existingTxSnap.docs[0].data();
          setStatus('success');
          setDetails({
            amount: existingTx.amount,
            alreadyProcessed: true,
          });
          setMessage('This payment was already processed. Redirecting to your wallet...');
          return;
        }

        // SIMULATION MODE - directly process
        const amount = Number(amountParam || 0);

        if (!amount || amount <= 0) {
          setStatus('error');
          setMessage('Invalid payment amount.');
          return;
        }

        // Update wallet directly
        const walletRef = doc(db, 'wallets', user.uid);
        const walletSnap = await getDoc(walletRef);

        let currentBalance = 0;
        if (walletSnap.exists()) {
          currentBalance = Number(walletSnap.data().balance || 0);
        } else {
          await setDoc(walletRef, {
            userId: user.uid,
            balance: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }

        const newBalance = currentBalance + amount;

        await updateDoc(walletRef, {
          balance: newBalance,
          updatedAt: new Date(),
        });

        // Record transaction
        await addDoc(collection(db, 'transactions'), {
          userId: user.uid,
          type: 'cash_in',
          amount: amount,
          status: 'completed',
          method: 'paymongo_simulation',
          description: 'Wallet cash-in (Simulated)',
          checkoutSessionId: sessionId,
          createdAt: new Date(),
        });

        setStatus('success');
        setDetails({
          amount: amount,
          newBalance: newBalance,
          simulated: true,
        });
        setMessage('Cash-in successful! Your wallet has been updated. Redirecting to your wallet...');
      } catch (error) {
        console.error('Cash-in processing failed:', error);
        setStatus('error');
        setMessage(error.message || 'Failed to process payment.');
      }
    };

    processSimulatedPayment();
  }, [isLoading, searchParams, user]);

  useEffect(() => {
    if (status !== 'success' || redirectRef.current) {
      return;
    }

    const amount = details?.amount;
    if (typeof amount === 'undefined') {
      return;
    }

    redirectRef.current = true;

    const numericAmount = Number(amount);
    const amountQuery = Number.isFinite(numericAmount) ? `&amount=${numericAmount}` : '';
    const timeout = setTimeout(() => {
      router.replace(`/student/wallet?cashIn=success${amountQuery}`);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [details, router, status]);

  const statusClasses = {
    pending: 'bg-blue-50 text-blue-600 border-blue-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    error: 'bg-red-50 text-red-600 border-red-200',
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-2xl border p-6 shadow-sm ${statusClasses[status] || statusClasses.pending}`}>
        <h1 className="text-2xl font-black mb-2">Cash-In (Simulation)</h1>
        <p className="text-sm font-medium">{message}</p>
        {details && (
          <div className="mt-4 space-y-2 text-sm">
            {'amount' in details && (
              <p className="font-semibold">Amount: ₱{Number(details.amount || 0).toFixed(2)}</p>
            )}
            {'newBalance' in details && (
              <p className="font-semibold">Current Wallet Balance: ₱{Number(details.newBalance || 0).toFixed(2)}</p>
            )}
            {details.simulated && (
              <p className="text-xs text-amber-600">🧪 This was a simulated transaction for testing purposes.</p>
            )}
            {details.alreadyProcessed && (
              <p className="text-xs">This payment was already recorded. No additional funds were added.</p>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Link
          href="/student/dashboard"
          className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}