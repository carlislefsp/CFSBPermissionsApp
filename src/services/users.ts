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
    console.log(`Fetching groups for user ${oid}...`);
    try {
      const groups = await this.fetch<Group[]>(`/users/${oid}/groups`);
      console.log(
        `Successfully fetched ${groups.length} groups for user ${oid}`,
      );
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

  static async getAllUserGroups(): Promise<Record<string, Group[]>> {
    console.log('Starting to fetch all users...');
    // First get all users
    const users = await this.getUsers();
    console.log(`Found ${users.length} users, fetching their groups...`);

    // Limit to first 3 users while debugging
    const limitedUsers = users.slice(0, 3);
    let errorCount = 0;
    const MAX_ERRORS = 3;

    // Then fetch groups for each user in parallel
    const userGroups = await Promise.all(
      limitedUsers.map(async user => {
        try {
          console.log(`Processing user ${user.oid}...`);
          const groups = await this.getUserGroups(user.oid);
          console.log(`Successfully processed user ${user.oid}`);
          return [user.oid, groups] as const;
        } catch (error) {
          // Only log first few errors
          if (errorCount < MAX_ERRORS) {
            console.error(
              `Failed to fetch groups for user ${user.oid}:`,
              error,
            );
            errorCount++;
            if (errorCount === MAX_ERRORS) {
              console.log('Suppressing further error logs...');
            }
          }
          return [user.oid, []] as const;
        }
      }),
    );

    console.log('Finished processing users');
    // Convert the array of [oid, groups] pairs into a Record
    return Object.fromEntries(userGroups);
  }
}
