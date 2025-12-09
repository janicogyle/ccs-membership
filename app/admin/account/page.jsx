'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function AdminAccountPage() {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Admin Account</h2>
      <p className="text-slate-600 max-w-2xl">
        Account details are managed centrally. Contact the system administrator if the primary admin information needs to
        change. Current signed-in admin: <span className="font-semibold text-slate-900">{user?.email || 'Unknown admin'}</span>.
      </p>
    </div>
  );
}
