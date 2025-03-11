import { Group } from '@/types/group';
import { User } from '@/types/user';
import { ApiService } from './api';

export class GroupService extends ApiService {
  static async getGroups(): Promise<Group[]> {
    return this.fetch<Group[]>('/groups');
  }

  static async getGroupById(id: string): Promise<Group> {
    return this.fetch<Group>(`/groups/${id}`);
  }

  static async createGroup(
    group: Omit<Group, 'id' | 'created' | 'updated'>,
  ): Promise<Group> {
    return this.fetch<Group>('/groups', {
      method: 'POST',
      body: JSON.stringify(group),
    });
  }

  static async updateGroup(id: string, group: Partial<Group>): Promise<Group> {
    return this.fetch<Group>(`/groups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(group),
    });
  }

  static async deleteGroup(id: string): Promise<void> {
    await this.fetch(`/groups/${id}`, {
      method: 'DELETE',
    });
  }

  static async getGroupUsers(groupId: string): Promise<User[]> {
    return this.fetch<User[]>(`/groups/${groupId}/users`);
  }

  static async getGroupsByLocalId(localId: string): Promise<Group[]> {
    return this.fetch<Group[]>(`/groupsbylocal/${localId}`);
  }

  static async getGroupByName(name: string): Promise<string> {
    return this.fetch<string>(`/groups/name/${encodeURIComponent(name)}`);
  }
}
