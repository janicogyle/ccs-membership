import { API_ENDPOINTS } from '../constants';

const TOKEN_KEY = 'auth_token';
const USER_STORAGE_KEY = 'auth_user';

class AuthService {
  storeToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }

  storeUser(user) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }
  }

  clearToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  }

  getStoredUser() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (!stored) return null;
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.warn('Failed to parse stored user', error);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    return null;
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  async login(credentials) {
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (data.success && data.token) {
        this.storeToken(data.token);
        if (data.user) {
          this.storeUser(data.user);
        }
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login' };
    }
  }

  async register(userData) {
    try {
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (data.success && data.token) {
        this.storeToken(data.token);
        if (data.user) {
          this.storeUser(data.user);
        }
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'An error occurred during registration' };
    }
  }

  async logout() {
    try {
      await fetch(API_ENDPOINTS.LOGOUT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      this.clearToken();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}

export default new AuthService();
