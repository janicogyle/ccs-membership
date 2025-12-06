'use client';

import { useRouter } from 'next/navigation';
import { Logo } from '@/components/atoms';
import { NavLink, AuthButtons } from '@/components/molecules';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Header({ className = '' }) {
  const { isAuthenticated, logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <header className={`bg-white shadow-sm border-b ${className}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/students">Students</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            {isAuthenticated && user?.isAdmin && (
              <NavLink href="/admin/dashboard">Admin</NavLink>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <Link
                href="/profile"
                className="text-gray-700 hover:text-blue-600 text-sm font-medium"
              >
                {user?.name}
              </Link>
            )}
            <AuthButtons
              isAuthenticated={isAuthenticated}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </nav>
    </header>
  );
}
