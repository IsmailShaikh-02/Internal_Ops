import { createContext, useContext, type ReactNode } from "react";

interface User {
  id: string;
  name: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const value: AuthContextValue = {
    isAuthenticated: true,
    user: {
      id: "1",
      name: "Platform Owner",
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}