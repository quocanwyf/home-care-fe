import { createContext, useContext, useEffect, useState } from 'react';

import { useAuthCheck } from '@/hooks/api/useAuthCheck';
import { useLogin } from '@/hooks/api/useLogin.api';
import { useLogout } from '@/hooks/api/useLogout.api';
import type { AuthContextType, LoginRequest, User } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const {
    data: authData,
    isLoading: isCheckingAuth,
    isError: isAuthError,
  } = useAuthCheck();

  useEffect(() => {
    if (authData) {
      setUser(authData);
    } else if (isAuthError) {
      setUser(null);
    }

    if (!isCheckingAuth) {
      setIsLoading(false);
    }
  }, [authData, isAuthError, isCheckingAuth]);

  const login = async (credentials: LoginRequest): Promise<void> => {
    const response = await loginMutation.mutateAsync(credentials);

    const userData: User = {
      user: response.user,
      messages: response.messages,
    };

    setUser(userData);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading: loginMutation.isPending || isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
