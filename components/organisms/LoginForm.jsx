'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/atoms';
import { FormField } from '@/components/molecules';

export default function LoginForm({ onSubmit, loading, error }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <FormField
          id="email"
          label="Email address"
          type="email"
          value={email}
          onChange={setEmail}
          required
          disabled={loading}
          placeholder="Email address"
        />
        
        <FormField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          required
          disabled={loading}
          placeholder="Password"
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
          fullWidth
          loading={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </div>

      <div className="text-center text-sm">
        <span className="text-gray-600">Don't have an account? </span>
        <Link
          href="/auth/signup"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Sign up
        </Link>
      </div>
    </form>
  );
}
