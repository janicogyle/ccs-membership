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
    <form className="space-y-6" onSubmit={handleSubmit}>
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
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </Button>

      <div className="text-center pt-2">
        <Link
          href="/auth/forgot-password"
          className="text-sm font-medium text-orange-600 hover:text-orange-500 transition-colors"
        >
          Forgot your password?
        </Link>
      </div>

      <p className="text-center text-base text-slate-600 pt-4 border-t border-slate-200">
        Don&apos;t have an account?{' '}
        <Link
          href="/auth/signup"
          className="font-semibold text-orange-600 hover:text-orange-500 transition-colors"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
