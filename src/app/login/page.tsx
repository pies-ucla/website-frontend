"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FiChevronRight } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { googleLoginURL } from "@/utils/auth";
import styles from "./login.module.css";

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();

  // already signed in, nothing to do here
  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  return (
    <main className={styles.page}>
      <section className={styles.formSide}>
        <div className={styles.form}>
          <Link href="/" className={styles.brand}>
            <Image src="/logo.png" alt="PIES logo" width={160} height={160} className={styles.logo} priority />
            <span className={styles.brandText}>PIES @ UCLA</span>
          </Link>

          <h1 className={styles.title}>Member Login</h1>
          <p className={styles.description}>
            Access members-only resources, the alumni network, and Ask Pierre, and stay connected with the
            Pilipino STEM community at UCLA.
          </p>

          <p className={styles.hint}>Please use your UCLA email to sign in.</p>
          <a href={googleLoginURL} className={styles.googleButton}>
            <FcGoogle className={styles.googleIcon} aria-hidden="true" />
            <span>Sign in with Google</span>
          </a>

          <Link href="/" className={styles.backLink}>
            Back to PIES website <FiChevronRight aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className={styles.photoSide} aria-hidden="true">
        <Image src="/pictures/pic1.jpg" alt="" fill sizes="60vw" className={styles.photo} priority />
      </section>
    </main>
  );
}
