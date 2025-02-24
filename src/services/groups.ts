import { Group } from '@/types/group';
import { ApiService } from './api';

export class GroupService extends ApiService {
  private static readonly GROUPS_ENDPOINT = '/groups/';

  static async getGroups(): Promise<Group[]> {
    return this.fetch<Group[]>(this.GROUPS_ENDPOINT);
  }

  static async getGroupById(id: string): Promise<Group> {
    return this.fetch<Group>(`${this.GROUPS_ENDPOINT}${id}`);
  }
}
