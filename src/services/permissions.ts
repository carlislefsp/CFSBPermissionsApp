import { Permission } from '@/types/permission';
import { ApiService } from './api';

export class PermissionService extends ApiService {
  static async getPermissions(): Promise<Permission[]> {
    return this.fetch<Permission[]>('/permissions');
  }

  static async getPermissionById(id: string): Promise<Permission> {
    return this.fetch<Permission>(`/permissions/${id}`);
  }

  static async createPermission(
    permission: Omit<Permission, 'id' | 'created' | 'updated'>,
  ): Promise<Permission> {
    return this.fetch<Permission>('/permissions', {
      method: 'POST',
      body: JSON.stringify(permission),
    });
  }

  static async updatePermission(
    id: string,
    permission: Partial<Permission>,
  ): Promise<Permission> {
    return this.fetch<Permission>(`/permissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(permission),
    });
  }

  static async deletePermission(id: string): Promise<void> {
    await this.fetch(`/permissions/${id}`, {
      method: 'DELETE',
    });
  }
}
