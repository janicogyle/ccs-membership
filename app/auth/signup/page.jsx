'use client';

import { RegisterForm } from '@/components/organisms';
import { AuthTemplate } from '@/components/templates';
import { useAuthRequest } from '@/hooks/useAuthRequest';

export default function SignupPage() {
  const { register, loading, error } = useAuthRequest();

  return (
    <AuthTemplate
      title="Create your account"
      subtitle={
        <>
          Already have an account?{' '}
          <a
            href="/auth/login"
            className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
          >
            Sign in
          </a>
        </>
      }
    >
      <RegisterForm
        onSubmit={register}
        loading={loading}
        error={error}
      />
    </AuthTemplate>
  );
}
