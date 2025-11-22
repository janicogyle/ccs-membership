// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

// Student Types
export interface Student {
  id: string;
  name: string;
  email: string;
  course: string;
  year: number;
  avatar?: string;
}

export interface StudentsResponse {
  success: boolean;
  students: Student[];
}
