import { API_ENDPOINTS } from '../constants';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const TOKEN_KEY = 'token';
const USER_STORAGE_KEY = 'user';

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
      // Sign in with Firebase Auth directly on client
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      
      const firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken();

      // Also call the API to get full user data
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      // Store token and user
      this.storeToken(token);
      if (data.user) {
        this.storeUser(data.user);
      } else {
        this.storeUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
        });
      }
      
      return { success: true, user: data.user, token };
    } catch (error) {
      console.error('Login error:', error);
      let message = 'An error occurred during login';
      if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Incorrect password';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address';
      } else if (error.code === 'auth/invalid-credential') {
        message = 'Invalid email or password';
      }
      return { success: false, message };
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
      // Sign out from Firebase Auth
      await signOut(auth);
      // Also call API logout
      await fetch(API_ENDPOINTS.LOGOUT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      this.clearToken();
    } catch (error) {
      console.error('Logout error:', error);
      this.clearToken();
    }
  }
}

export default new AuthService();
