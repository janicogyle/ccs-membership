import { API_ENDPOINTS } from '../constants';

const TOKEN_KEY = 'auth_token';

class AuthService {
  storeToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }

  clearToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
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
