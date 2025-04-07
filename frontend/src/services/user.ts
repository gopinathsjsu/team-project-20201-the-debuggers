import { apiClient } from '../lib/api';
import { User } from '../types/auth';
import { PaginatedResponse } from '../types/api';

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface UserFilters {
  search?: string;
  role?: string;
  page?: number;
  pageSize?: number;
}

class UserService {
  private static instance: UserService;
  private readonly baseUrl = '/users';

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<{ user: User }>(`${this.baseUrl}/me`);
    return response.data.user;
  }

  async updateProfile(data: UpdateUserData): Promise<User> {
    const response = await apiClient.patch<{ user: User }>(
      `${this.baseUrl}/profile`,
      data
    );
    return response.data.user;
  }

  async getUser(userId: string): Promise<User> {
    const response = await apiClient.get<{ user: User }>(
      `${this.baseUrl}/${userId}`
    );
    return response.data.user;
  }

  async listUsers(page = 1, limit = 10): Promise<{ users: User[]; total: number }> {
    const response = await apiClient.get<{ users: User[]; total: number }>(
      `${this.baseUrl}`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  }

  async getUsers(filters: UserFilters = {}): Promise<PaginatedResponse<User>> {
    const response = await apiClient.get<PaginatedResponse<User>>(this.baseUrl, {
      params: filters,
    });
    return response.data;
  }

  async updateUser(userId: string, data: UpdateUserData): Promise<User> {
    const response = await apiClient.patch<{ user: User }>(
      `${this.baseUrl}/${userId}`,
      data
    );
    return response.data.user;
  }

  async deleteUser(userId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${userId}`);
  }

  async exportUsers(filters: UserFilters = {}): Promise<Blob> {
    const response = await apiClient.get('/users/export', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  }
}

export const userService = UserService.getInstance(); 