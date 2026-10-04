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
  logout: () => void;
  refreshAuth: () => Promise<boolean>;
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

  const refreshAuth = useCallback(async (): Promise<boolean> => {
    const refreshed = await refreshAccessTokenAndUser();
    if (refreshed) {
      setAccessToken(refreshed.access_token);
      setUser(refreshed.user);

      const [boardRes, adminRes] = await Promise.all([
        fetch(`${API_URL}/api/is-board-member`, { credentials: "include" }),
        fetch(`${API_URL}/api/is-admin`, { credentials: "include" }),
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
    return !!refreshed;
  }, []);

  useEffect(() => {
    refreshAuth().finally(() => setLoading(false));
  }, [refreshAuth]);

  const logout = async () => {
    setAccessToken(null);
    setUser(null);
    setIsBoardMember(false);
    setIsAdmin(false);
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
    });
    setLoading(false);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, isBoardMember, isAdmin, logout, refreshAuth }}>
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
    const res = await fetch(`/api/auth/refresh`, {
      method: "POST",
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
