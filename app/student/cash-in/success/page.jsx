'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function CashInSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [status, setStatus] = useState('pending');
  const [message, setMessage] = useState('Verifying your PayMongo payment...');
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const sessionId = searchParams.get('checkout_session_id');
    const simulatedAmount = searchParams.get('simulated_amount');

    if (!sessionId) {
      setStatus('error');
      setMessage('Missing PayMongo session information.');
      return;
    }

    if (!user?.uid || isLoading) {
      return;
    }

    const confirmCashIn = async () => {
      try {
        const response = await fetch('/api/paymongo/confirm-cash-in', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            userId: user.uid,
            simulatedAmount: simulatedAmount ? Number(simulatedAmount) : undefined,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          setStatus('error');
          setMessage(data?.error || 'Unable to confirm your payment.');
          setDetails({ sessionStatus: data?.status });
          return;
        }

        setStatus('success');
        const isSimulated = data.status === 'simulated_paid';
        setMessage(
          data.alreadyProcessed
            ? 'This payment session was already recorded earlier. No additional funds were added to your wallet.'
            : isSimulated
            ? 'Simulated PayMongo payment completed. Your wallet was updated for testing purposes.'
            : 'Cash-in successful! Your wallet has been updated.'
        );
        setDetails({
          amount: data.amount,
          newBalance: data.newBalance,
          alreadyProcessed: data.alreadyProcessed,
          sessionStatus: data.status,
        });
      } catch (error) {
        console.error('Cash-in verification failed:', error);
        setStatus('error');
        setMessage('We could not verify your payment at this time.');
      }
    };

    confirmCashIn();
  }, [isLoading, searchParams, user]);

  const statusClasses = {
    pending: 'bg-blue-50 text-blue-600 border-blue-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    error: 'bg-red-50 text-red-600 border-red-200',
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-2xl border p-6 shadow-sm ${statusClasses[status] || statusClasses.pending}`}>
        <h1 className="text-2xl font-black mb-2">PayMongo Cash-in</h1>
        <p className="text-sm font-medium">{message}</p>
        {details && (
          <div className="mt-4 space-y-2 text-sm">
            {'amount' in details && (
              <p className="font-semibold">Amount: ₱{Number(details.amount || 0).toFixed(2)}</p>
            )}
            {'newBalance' in details && (
              <p className="font-semibold">Current Wallet Balance: ₱{Number(details.newBalance || 0).toFixed(2)}</p>
            )}
            {details.sessionStatus && (
              <p className="text-xs uppercase tracking-wide">PayMongo Status: {details.sessionStatus}</p>
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
        <Link
          href="/student/payments"
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          View Payment History
        </Link>
      </div>
    </div>
  );
}