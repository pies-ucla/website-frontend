"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

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
  login: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ====== Provider ======
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const tryRefresh = async () => {
      const refreshed = await refreshAccessTokenAndUser();
      if (refreshed) {
        setAccessToken(refreshed.access_token);
        setUser(refreshed.user);
      }
      setLoading(false);
    };

    tryRefresh();
  }, []);

  const login = (token: string, user: User) => {
    setAccessToken(token);
    setUser(user);
  };

  const logout = async () => {
    setAccessToken(null);
    setUser(null);
    await fetch('/api/auth/logout', {
      method: 'POST',
    });
    
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, logout }}>
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
    const res = await fetch("http://localhost:8000/token/refresh/", {
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
