'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function DashboardRouterPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else {
        switch (user.role) {
          case 'ADMIN':
            router.push('/dashboard/admin');
            break;
          case 'OFFICER':
            router.push('/dashboard/officer');
            break;
          case 'FARMER':
          default:
            router.push('/dashboard/farmer');
            break;
        }
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white">
      <div className="text-center space-y-4">
        <div className="h-10 w-10 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin mx-auto" />
        <p className="text-neutral-500 font-semibold text-sm">Directing to your console...</p>
      </div>
    </div>
  );
}
