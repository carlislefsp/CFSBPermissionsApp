import { Group, GroupType } from '@/types/group';
import { ApiService } from './api';

export class GroupTypeService extends ApiService {
  static async getGroupTypes(
    limit?: number,
    offset?: number,
  ): Promise<GroupType[]> {
    return this.fetchWithPagination<GroupType[]>('/grouptypes', limit, offset);
  }

  static async getGroupTypeById(id: number): Promise<GroupType> {
    return this.fetch<GroupType>(`/grouptypes/${id}`);
  }

  static async createGroupType(
    groupType: Omit<GroupType, 'id' | 'created' | 'updated'>,
  ): Promise<GroupType> {
    return this.fetch<GroupType>('/grouptypes', {
      method: 'POST',
      body: JSON.stringify(groupType),
    });
  }

  static async updateGroupType(
    id: number,
    groupType: Partial<GroupType>,
  ): Promise<GroupType> {
    return this.fetch<GroupType>(`/grouptypes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(groupType),
    });
  }

  static async deleteGroupType(id: number): Promise<void> {
    await this.fetch(`/grouptypes/${id}`, {
      method: 'DELETE',
    });
  }

  static async getGroupsByGroupType(
    groupTypeId: number,
    limit?: number,
    offset?: number,
  ): Promise<Group[]> {
    return this.fetchWithPagination<Group[]>(
      `/grouptypes/${groupTypeId}/groups`,
      limit,
      offset,
    );
  }

  static async getGroupsByGroupTypeAndLocalId(
    groupTypeId: number,
    localId: string,
    limit?: number,
    offset?: number,
  ): Promise<Group[]> {
    return this.fetchWithPagination<Group[]>(
      `/grouptypes/${groupTypeId}/groups/${localId}`,
      limit,
      offset,
    );
  }
}
