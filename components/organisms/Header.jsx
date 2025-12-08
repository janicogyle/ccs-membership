'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/atoms';
import { NavLink, AuthButtons } from '@/components/molecules';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Header({ className = '' }) {
  const { isAuthenticated, logout, user } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    logout();
    router.push('/auth/login');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`bg-orange-500 fixed top-0 left-0 right-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo size="md" showText={true} />

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            {isAuthenticated && user?.isAdmin && (
              <NavLink href="/admin/dashboard">Admin</NavLink>
            )}
            
            <div className="w-px h-5 bg-white/30 mx-3"></div>
            
            {isAuthenticated && (
              <Link
                href="/profile"
                className="text-white/90 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {user?.name}
              </Link>
            )}
            
            <AuthButtons
              isAuthenticated={isAuthenticated}
              onLogout={handleLogout}
            />
          </div>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 space-y-2">
            <div className="flex flex-col gap-2">
              <Link 
                href="/" 
                className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              {isAuthenticated && user?.isAdmin && (
                <Link 
                  href="/admin/dashboard" 
                  className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              
              <div className="h-px bg-white/10 my-2 mx-4"></div>
              
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile ({user?.name})
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-4">
                  <Link 
                    href="/auth/login"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <button className="w-full text-white px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                      Login
                    </button>
                  </Link>
                  <Link 
                    href="/auth/signup"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <button className="w-full text-orange-600 px-4 py-2 rounded-lg bg-white hover:bg-orange-50 transition-colors font-medium">
                      Register
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
