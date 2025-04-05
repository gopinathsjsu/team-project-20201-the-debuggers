import { api } from '../lib/api';
import {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  ResetPasswordData,
  UpdatePasswordData,
  User,
} from '../types/auth';

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  }

  static async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  }

  static async getCurrentUser(): Promise<User> {
    const response = await api.get<{ user: User }>('/auth/me');
    return response.data.user;
  }

  static async resetPassword(data: ResetPasswordData): Promise<void> {
    await api.post('/auth/reset-password', data);
  }

  static async updatePassword(data: UpdatePasswordData): Promise<void> {
    await api.post('/auth/update-password', data);
  }

  static async refreshToken(): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/refresh');
    return response.data;
  }

  static async logout(): Promise<void> {
    await api.post('/auth/logout');
  }

  static async verifyEmail(token: string): Promise<void> {
    await api.post(`/auth/verify-email/${token}`);
  }

  static async resendVerificationEmail(): Promise<void> {
    await api.post('/auth/resend-verification');
  }
} 