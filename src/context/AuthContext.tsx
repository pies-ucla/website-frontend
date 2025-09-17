"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
const API_URL =  process.env.NEXT_PUBLIC_API_URL;

// ====== Types ======
type User = {
  pk: number;
  email: string;
  first_name: string;
  last_name: string;
  major: string;
  minor: string;
  position: string;
};

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  isBoardMember: boolean;
  isAdmin: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ====== Provider ======
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isBoardMember, setIsBoardMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const tryRefresh = async () => {
      const refreshed = await refreshAccessTokenAndUser();
      if (refreshed) {
        setAccessToken(refreshed.access_token);
        setUser(refreshed.user);

        const [boardRes, adminRes] = await Promise.all([
          fetch("/api/is-board-member", { credentials: "include" }),
          fetch("/api/is-admin", { credentials: "include" }),
        ]);

        if (boardRes.ok) {
          const data = await boardRes.json();
          setIsBoardMember(data.isBoardMember);
        }

        if (adminRes.ok) {
          const data = await adminRes.json();
          setIsAdmin(data.isAdmin);
        }
      }
      setLoading(false);
    };

    tryRefresh();
  }, []);

  const login = useCallback(async (token: string, user: User) => {
    setAccessToken(token);
    setUser(user);

    try {
      const [boardRes, adminRes] = await Promise.all([
        fetch("/api/is-board-member", { credentials: "include" }),
        fetch("/api/is-admin", { credentials: "include" }),
      ]);

      if (boardRes.ok) {
        const data = await boardRes.json();
        setIsBoardMember(data.isBoardMember);
      }

      if (adminRes.ok) {
        const data = await adminRes.json();
        setIsAdmin(data.isAdmin);
      }
    } catch (err) {
      console.error("Failed to check board membership:", err);
    }
  }, []);

  const logout = async () => {
    setAccessToken(null);
    setUser(null);
    setIsBoardMember(false);
    setIsAdmin(false);
    await fetch('/api/auth/logout', {
      method: 'POST',
    });
    setLoading(false);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, isBoardMember, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ====== Hook ======
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// ====== Helpers ======

type TokenResponse = {
  access_token: string;
  user: User;
};

async function refreshAccessTokenAndUser(): Promise<TokenResponse | null> {
  try {
    const res = await fetch(`${API_URL}/token/refresh/`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return {
      access_token: data.access_token,
      user: data.user,
    };
  } catch (err) {
    console.error("Token refresh error:", err);
    return null;
  }
}
