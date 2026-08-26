'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './AuthGuard.module.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      setShowModal(true);
    }
  }, [loading, user, router]);

  if (loading) {
    return <p className="p-4 text-center">Loading…</p>;
  }

  if (showModal) {
    return (
      <div className={styles.modalBackdrop}>
        <div className={styles.modal}>
          <h2>You must be logged in to access this page.</h2>
          <Link href="/" className={styles.button}>Go to Home</Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}