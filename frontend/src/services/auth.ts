import { LoginCredentials, RegisterData, AuthResponse } from '../types/auth';
import { apiClient } from '../lib/api';

class AuthService {
  private static instance: AuthService;
  private readonly baseUrl = '/auth';

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `${this.baseUrl}/login`,
      credentials
    );
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `${this.baseUrl}/register`,
      data
    );
    return response.data;
  }

  async logout(): Promise<void> {
    await apiClient.post(`${this.baseUrl}/logout`);
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `${this.baseUrl}/refresh-token`
    );
    return response.data;
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      await apiClient.post(`${this.baseUrl}/validate-token`, { token });
      return true;
    } catch {
      return false;
    }
  }
}

export const authService = AuthService.getInstance(); 