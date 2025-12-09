import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../services/authService';
import { MESSAGES } from '../constants';

export const useAuthRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleAuth = useCallback(async (action, data, redirectPath, errorMsg) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await action(data);
      
      if (result.success) {
        router.push(redirectPath);
        return { success: true };
      }
      
      setError(result.message || errorMsg);
      return { success: false, error: result.message };
    } catch (err) {
      setError(MESSAGES.GENERIC_ERROR);
      return { success: false, error: MESSAGES.GENERIC_ERROR };
    } finally {
      setLoading(false);
    }
  }, [router]);

  const login = useCallback(
    (credentials) => handleAuth(authService.login.bind(authService), credentials, '/student/dashboard', MESSAGES.LOGIN_FAILED),
    [handleAuth]
  );

  const register = useCallback(
    (userData) => handleAuth(authService.register.bind(authService), userData, '/student/dashboard', MESSAGES.REGISTER_FAILED),
    [handleAuth]
  );

  const logout = useCallback(async () => {
    setLoading(true);
    await authService.logout();
    setTimeout(() => {
      router.push('/auth/login');
      setLoading(false);
    }, 100);
  }, [router]);

  return { login, register, logout, loading, error };
};
