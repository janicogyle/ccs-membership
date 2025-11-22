'use client';

import Link from 'next/link';
import { Button } from '@/components/atoms';

export default function AuthButtons({
  isAuthenticated,
  onLogout,
}) {
  if (isAuthenticated) {
    return (
      <Button
        variant="danger"
        onClick={onLogout}
      >
        Logout
      </Button>
    );
  }
  
  return (
    <div className="flex items-center space-x-4">
      <Link
        href="/auth/login"
        className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
      >
        Login
      </Link>
      <Link href="/auth/signup">
        <Button variant="primary">
          Sign Up
        </Button>
      </Link>
    </div>
  );
}
