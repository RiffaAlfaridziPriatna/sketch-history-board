import { useState, useEffect, useCallback } from 'react';
import { User } from '@/services/AuthService';
import { serviceContainer } from '@/services/ServiceContainer';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const authService = serviceContainer.getAuthService();

  const initializeAuth = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const user = await authService.initializeAuth();
      setUser(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize authentication');
    } finally {
      setLoading(false);
    }
  }, [authService]);

  const refreshAuth = useCallback(async () => {
    try {
      const authResponse = await authService.validateToken();
      setUser(authResponse.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh authentication');
    }
  }, [authService]);

  const logout = useCallback(() => {
    authService.removeAccessToken();
    setUser(null);
  }, [authService]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    refreshAuth,
    logout,
  };
};
