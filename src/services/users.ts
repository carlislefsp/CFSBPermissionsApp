import { User } from '@/types/user';
import { ApiService } from './api';

export class UserService extends ApiService {
  private static readonly USERS_ENDPOINT = '/users/';

  static async getUsers(): Promise<User[]> {
    return this.fetch<User[]>(this.USERS_ENDPOINT);
  }

  // Add other user-related methods
  static async getUserById(id: string): Promise<User> {
    return this.fetch<User>(`${this.USERS_ENDPOINT}${id}`);
  }
}
