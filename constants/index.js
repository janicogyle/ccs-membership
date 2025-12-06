export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  REGISTER: '/api/auth/register',
  PROFILE: '/api/auth/profile',
  STUDENTS: '/api/students',
  STUDENTS_DETAIL: (id) => `/api/students/${id}`,
};

export const APP_NAME = 'CCS Membership';

export const MESSAGES = {
  LOGIN_FAILED: 'Login failed. Please check your credentials.',
  REGISTER_FAILED: 'Registration failed. Please try again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  UNAUTHORIZED: 'You must be logged in to access this resource.',
  SUCCESS: 'Operation completed successfully.',
  ERROR: 'An error occurred. Please try again.',
};
