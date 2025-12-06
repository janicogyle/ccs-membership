'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/atoms';
import { FormField } from '@/components/molecules';
import { useAuth } from '@/contexts/AuthContext';
import { API_ENDPOINTS, MESSAGES } from '@/constants';
import authService from '@/services/authService';

export default function RegisterForm({ onSubmit, loading: externalLoading, error: externalError }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(externalLoading || false);
  const [error, setError] = useState(externalError || null);
  const [validationError, setValidationError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setError(null);

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const result = await authService.register({ name, email, password });

      if (result.success) {
        login(result.user, result.token);
        router.push('/');
      } else {
        setError(result.message || MESSAGES.REGISTER_FAILED);
      }
    } catch (err) {
      setError(MESSAGES.GENERIC_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <FormField
          id="name"
          label="Full Name"
          type="text"
          value={name}
          onChange={setName}
          required
          disabled={loading}
          placeholder="John Doe"
        />

        <FormField
          id="email"
          label="Email address"
          type="email"
          value={email}
          onChange={setEmail}
          required
          disabled={loading}
          placeholder="john@example.com"
        />
        
        <FormField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          required
          disabled={loading}
          placeholder="••••••••"
        />

        <FormField
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          required
          disabled={loading}
          placeholder="••••••••"
          error={validationError}
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </div>

      <div className="text-center text-sm">
        <span className="text-gray-600">Already have an account? </span>
        <Link
          href="/auth/login"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
}
