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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [block, setBlock] = useState('');
  const [program, setProgram] = useState('');
  const [year, setYear] = useState('');
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
      const result = await authService.register({ 
        firstName, 
        lastName, 
        email, 
        phoneNumber,
        block, 
        program, 
        year,
        password 
      });

      if (result.success) {
        login(result.user, result.token);
        router.push('/student/dashboard');
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
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            id="firstName"
            label="First Name"
            type="text"
            value={firstName}
            onChange={setFirstName}
            required
            disabled={loading}
            placeholder="John"
          />
          <FormField
            id="lastName"
            label="Last Name"
            type="text"
            value={lastName}
            onChange={setLastName}
            required
            disabled={loading}
            placeholder="Doe"
          />
        </div>

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
          id="phoneNumber"
          label="Phone Number"
          type="tel"
          value={phoneNumber}
          onChange={setPhoneNumber}
          required
          disabled={loading}
          placeholder="09XX XXX XXXX"
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            id="program"
            label="Program"
            type="text"
            value={program}
            onChange={setProgram}
            required
            disabled={loading}
            placeholder="BSIT"
          />
          <FormField
            id="year"
            label="Year"
            type="text"
            value={year}
            onChange={setYear}
            required
            disabled={loading}
            placeholder="1"
          />
          <FormField
            id="block"
            label="Block"
            type="text"
            value={block}
            onChange={setBlock}
            required
            disabled={loading}
            placeholder="A"
          />
        </div>
        
        <FormField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          required
          disabled={loading}
          placeholder="Create a password"
        />

        <FormField
          id="confirmPassword"
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          required
          disabled={loading}
          placeholder="Confirm your password"
          error={validationError}
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
        {loading ? 'Creating account...' : 'Create account'}
      </Button>

      <p className="text-center text-base text-slate-600 pt-4 border-t border-slate-200">
        Already have an account?{' '}
        <Link
          href="/auth/login"
          className="font-semibold text-orange-600 hover:text-orange-500 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
