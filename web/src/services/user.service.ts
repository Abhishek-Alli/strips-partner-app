// Re-export from new centralized service
export {
  userService,
  type UsersResponse,
  type CreateUserData,
  type UpdateUserData
} from './userService';

export interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateUserData {
  email: string;
  name: string;
  password?: string;
  role: string;
  phone?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: string;
  phone?: string;
  is_active?: boolean;
  password?: string;
}

class UserService {
  async getAllUsers(page = 1, limit = 10, search = ''): Promise<UsersResponse> {
    const response = await api.get<UsersResponse>('/users', {
      params: { page, limit, search }
    });
    return response.data;
  }

  async getUserById(id: string): Promise<{ user: User }> {
    const response = await api.get<{ user: User }>(`/users/${id}`);
    return response.data;
  }

  async createUser(data: CreateUserData): Promise<{ user: User }> {
    const response = await api.post<{ user: User }>('/users', data);
    return response.data;
  }

  async updateUser(id: string, data: UpdateUserData): Promise<{ user: User }> {
    const response = await api.put<{ user: User }>(`/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/users/${id}`);
    return response.data;
  }
}

export const userService = new UserService();



