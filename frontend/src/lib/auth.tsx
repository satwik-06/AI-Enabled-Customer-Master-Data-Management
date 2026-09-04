"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AuthUser, UserRole } from "./types";

const STORAGE_KEY = "mdm.auth.user";

const TEST_ACCOUNTS: Record<string, AuthUser & { password: string }> = {
  "sales@micron.com": {
    name: "Jordan Reyes",
    email: "sales@micron.com",
    role: "sales",
    team: "Global Sales",
    password: "sales123",
  },
  "steward@micron.com": {
    name: "Amara Chen",
    email: "steward@micron.com",
    role: "steward",
    team: "Data Governance",
    password: "steward123",
  },
};

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // One-time sync from localStorage (an external system) on mount.
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setUser(JSON.parse(stored));
    } catch {
      // ignore corrupted local storage
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((email: string, password: string) => {
    const account = TEST_ACCOUNTS[email.trim().toLowerCase()];
    if (!account || account.password !== password) {
      return { ok: false, error: "Invalid email or password." };
    }
    const { password: _password, ...authUser } = account;
    void _password;
    setUser(authUser);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const hasRole = useCallback(
    (role: UserRole) => user?.role === role,
    [user]
  );

  const value = useMemo(
    () => ({ user, isLoading, login, logout, hasRole }),
    [user, isLoading, login, logout, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
