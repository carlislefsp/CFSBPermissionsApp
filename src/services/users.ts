import { User, GroupUserPermission } from '@/types/user';
import { Group } from '@/types/group';
import { Permission } from '@/types/permission';
import { ApiService } from './api';

export class UserService extends ApiService {
  static async getUsers(): Promise<User[]> {
    const users = await this.fetch<User[]>('/users');
    return users;
  }

  static async getUserById(oid: string): Promise<User> {
    return this.fetch<User>(`/users/${oid}`);
  }

  static async getUserGroups(oid: string): Promise<Group[]> {
    console.log(`Fetching groups for user ${oid}...`);
    try {
      const groups = await this.fetch<Group[]>(`/users/${oid}/groups`);

      return groups;
    } catch (error) {
      console.error(`Error fetching groups for user ${oid}:`, error);
      throw error;
    }
  }

  static async getUserGroupPermissions(
    oid: string,
    groupId: string,
  ): Promise<Permission[]> {
    return this.fetch<Permission[]>(
      `/users/${oid}/groups/${groupId}/permissions`,
    );
  }

  static async getUserGroupPermission(
    oid: string,
    groupId: string,
    permissionId: string,
  ): Promise<GroupUserPermission> {
    return this.fetch<GroupUserPermission>(
      `/users/${oid}/groups/${groupId}/permissions/${permissionId}`,
    );
  }

  static async assignPermissionToUserGroup(
    oid: string,
    groupId: string,
    permissionId: string,
  ): Promise<GroupUserPermission> {
    return this.fetch<GroupUserPermission>(
      `/users/${oid}/groups/${groupId}/permissions/${permissionId}`,
      {
        method: 'POST',
      },
    );
  }

  static async removePermissionFromUserGroup(
    oid: string,
    groupId: string,
    permissionId: string,
  ): Promise<void> {
    await this.fetch(
      `/users/${oid}/groups/${groupId}/permissions/${permissionId}`,
      {
        method: 'DELETE',
      },
    );
  }
}
