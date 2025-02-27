import { User, GroupUserPermission } from '@/types/user';
import { Group } from '@/types/group';
import { Permission } from '@/types/permission';
import { ApiService } from './api';

export class UserService extends ApiService {
  static async getUsers(): Promise<User[]> {
    return this.fetch<User[]>('/users');
  }

  static async getUserById(oid: string): Promise<User> {
    return this.fetch<User>(`/users/${oid}`);
  }

  static async getUserGroups(oid: string): Promise<Group[]> {
    return this.fetch<Group[]>(`/users/${oid}/groups`);
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

  static async getAllUserGroups(): Promise<Record<string, Group[]>> {
    // First get all users
    const users = await this.getUsers();

    // Then fetch groups for each user in parallel
    const userGroups = await Promise.all(
      users.map(async user => {
        try {
          const groups = await this.getUserGroups(user.oid);
          return [user.oid, groups] as const;
        } catch (error) {
          console.error(`Failed to fetch groups for user ${user.oid}:`, error);
          return [user.oid, []] as const;
        }
      }),
    );

    // Convert the array of [oid, groups] pairs into a Record
    return Object.fromEntries(userGroups);
  }
}
