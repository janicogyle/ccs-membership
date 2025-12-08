'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/atoms';
import { FormField } from '@/components/molecules';
import { useAuth } from '@/contexts/AuthContext';
import { API_ENDPOINTS, MESSAGES } from '@/constants';
import authService from '@/services/authService';

export default function LoginForm({ onSubmit, loading: externalLoading, error: externalError }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(externalLoading || false);
  const [error, setError] = useState(externalError || null);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await authService.login({ email, password });

      if (result.success) {
        login(result.user, result.token);
        
        // Redirect based on user role
        if (result.user.isAdmin) {
          router.push('/admin/dashboard');
        } else {
          router.push('/student/dashboard');
        }
      } else {
        setError(result.message || MESSAGES.LOGIN_FAILED);
      }
    } catch (err) {
      setError(MESSAGES.GENERIC_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div className="space-y-5">
        <FormField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          required
          disabled={loading}
          placeholder="name@example.com"
          labelClassName="text-white/80"
        />
        
        <FormField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          required
          disabled={loading}
          placeholder="Enter your password"
          labelClassName="text-white/80"
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-900/20 border border-red-500/30 px-4 py-3">
          <p className="text-sm text-red-400 font-medium">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-end text-sm">
        <Link
          href="/auth/forgot-password"
          className="font-medium text-orange-300 transition-colors hover:text-orange-200"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
        disabled={loading}
        className="h-12 text-base"
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </Button>

      <p className="border-t border-white/10 pt-6 text-center text-base text-white/70">
        New? Don&apos;t have an account yet?{' '}
        <Link
          href="/auth/signup"
          className="font-semibold text-orange-200 transition-colors hover:text-white"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
