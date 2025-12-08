'use client';

import Link from 'next/link';

export default function CashInCancelPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-800 shadow-sm">
        <h1 className="text-2xl font-black mb-3">Payment Cancelled</h1>
        <p className="text-sm">
          Your PayMongo checkout session was cancelled or did not complete. No funds were added to your wallet.
        </p>
        <p className="text-sm mt-3">
          You can try again at any time. If this was unexpected, please double-check your payment details before retrying.
        </p>
      </div>

      <div className="flex gap-3">
        <Link
          href="/student/dashboard"
          className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
        >
          Back to Dashboard
        </Link>
        <Link
          href="/student/dashboard#cash-in"
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Try Cash-in Again
        </Link>
      </div>
    </div>
  );
}