"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
// const API_URL =  process.env.NEXT_PUBLIC_API_URL;
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;

export default function CallbackPage() {
  const { refreshAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) return;

    const fetchTokens = async () => {
      try {
        const res = await fetch(`${REDIRECT_URI}/api/auth/callback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            redirect_uri: `${REDIRECT_URI}/auth/callback`,
          }),
        });

        const data = await res.json();
        if (res.ok && data.access) {
          // The callback response doesn't reliably include the user object,
          // so pull it via the refresh endpoint using the cookies just set.
          await refreshAuth();
          router.push("/");
        } else {
          console.error("Login failed:", data);
        }
      } catch (err) {
        console.error("Callback error:", err);
      }
    };

    fetchTokens();
  }, [router, refreshAuth]);

  return <p className="p-4 text-center">Logging you in…</p>;
}
