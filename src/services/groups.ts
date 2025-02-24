import { Group } from '@/types/group';
import { ApiService } from './api';

export class GroupService extends ApiService {
  static async getGroups(): Promise<Group[]> {
    return this.fetch<Group[]>('/groups');
  }

  static async getGroupById(id: string): Promise<Group> {
    return this.fetch<Group>(`/groups/${id}`);
  }
}
