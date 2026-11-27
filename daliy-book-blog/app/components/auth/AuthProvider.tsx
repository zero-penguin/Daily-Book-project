
"use client";

import "aws-amplify/auth/enable-oauth-listener";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  fetchAuthSession,
  getCurrentUser,
  signInWithRedirect,
  signOut,
  type AuthUser,
} from "aws-amplify/auth";

import "../../lib/auth";

type AuthContextType = {
  user: AuthUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();

      const groups = session.tokens?.idToken?.payload[
        "cognito:groups"
      ];

      const admin = Array.isArray(groups) && groups.includes("Admins");

      setUser(currentUser);
      setIsAdmin(admin);
    } catch {
      setUser(null);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refreshAuth();
  }, []);

  const login = async () => {
    await signInWithRedirect();
  };

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isLoading,
        login,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
}
