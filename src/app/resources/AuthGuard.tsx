'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './AuthGuard.module.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingText from '@/components/LoadingText/LoadingText';

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
    return (
      <div className={styles.loading}>
        <LoadingText />
      </div>
    );
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