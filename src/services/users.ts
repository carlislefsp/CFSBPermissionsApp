import { User } from '@/types/user';
import { ApiService } from './api';

export class UserService extends ApiService {
  static async getUsers(): Promise<User[]> {
    return this.fetch<User[]>('/users');
  }

  // Add other user-related methods
  static async getUserById(id: string): Promise<User> {
    return this.fetch<User>(`/users/${id}`);
  }
}
