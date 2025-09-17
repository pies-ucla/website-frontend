"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
const API_URL =  process.env.NEXT_PUBLIC_API_URL;

export default function CallbackPage() {
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) return;

    const fetchTokens = async () => {
      try {
        const res = await fetch("/api/auth/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            redirect_uri: `${API_URL}/auth/callback`,
          }),
        });

        const data = await res.json();
        console.log("daters", data);
        if (res.ok && data.access && data.user) {
          login(data.access, data.user);
          router.push("/");
        } else {
          console.error("Login failed:", data);
        }
      } catch (err) {
        console.error("Callback error:", err);
      }
    };

    fetchTokens();
  }, [router, login]);

  return <p className="p-4 text-center">Logging you in…</p>;
}
