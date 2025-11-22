'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Logo } from '@/components/atoms';
import { NavLink, AuthButtons } from '@/components/molecules';
import authService from '@/services/authService';

export default function Header({ className = '' }) {
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
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
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
