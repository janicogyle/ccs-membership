'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../services/authService';
import { APP_NAME } from '../constants';

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    router.push('/auth/login');
  };

  return (
    <header className="bg-orange-500 shadow-md fixed top-0 left-0 right-0 z-50">
      <nav className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-white hover:text-orange-100 transition-colors">
              CCS MemberLink
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-white hover:text-orange-100 text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-white hover:text-orange-100 text-sm font-medium transition-colors"
            >
              About
            </Link>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="bg-white text-orange-600 hover:bg-orange-50 px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-white hover:text-orange-100 px-4 py-2 rounded-lg text-sm font-semibold border-2 border-white hover:bg-white hover:text-orange-500 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-white text-orange-600 hover:bg-orange-50 px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
