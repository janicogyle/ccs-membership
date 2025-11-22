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
            className="font-medium text-blue-600 hover:text-blue-500"
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
