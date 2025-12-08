'use client';

import { LoginForm } from '@/components/organisms';
import { AuthTemplate } from '@/components/templates';
import { useAuthRequest } from '@/hooks/useAuthRequest';

export default function LoginPage() {
  const { login, loading, error } = useAuthRequest();

  return (
    <AuthTemplate
      title="Sign in to your account"
      subtitle={
        <>
          Or{' '}
          <a
            href="/auth/signup"
            className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
          >
            create a new account
          </a>
        </>
      }
    >
      <LoginForm
        onSubmit={login}
        loading={loading}
        error={error}
      />
    </AuthTemplate>
  );
}
