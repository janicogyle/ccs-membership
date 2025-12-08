'use client';

import Link from 'next/link';
import { Button } from '@/components/atoms';

export default function AuthButtons({
  isAuthenticated,
  onLogout,
}) {
  if (isAuthenticated) {
    return (
      <button
        onClick={onLogout}
        className="text-sm text-white/90 hover:text-white px-4 py-2 rounded-lg border border-white/30 hover:bg-white/10 transition-colors"
      >
        Logout
      </button>
    );
  }
  
  return (
    <div className="flex items-center gap-2">
      <Link href="/auth/login">
        <button className="text-sm text-white px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
          Login
        </button>
      </Link>
      <Link href="/auth/signup">
        <button className="text-sm text-orange-600 px-4 py-2 rounded-lg bg-white hover:bg-orange-50 transition-colors font-medium">
          Register
        </button>
      </Link>
    </div>
  );
}
