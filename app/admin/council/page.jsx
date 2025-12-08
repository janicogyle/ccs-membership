'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CouncilPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to unified members page with council tab
    router.push('/admin/members?tab=council');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Redirecting to Members page...</p>
      </div>
    </div>
  );
}
