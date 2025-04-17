'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/'); // Redirect if unauthenticated
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <p className="p-4 text-center">Loading…</p>;
  }

  return <>{children}</>;
}
