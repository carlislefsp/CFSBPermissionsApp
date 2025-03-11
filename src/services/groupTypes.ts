import { Group, GroupType } from '@/types/group';
import { ApiService } from './api';

export class GroupTypeService extends ApiService {
  static async getGroupTypes(): Promise<GroupType[]> {
    return this.fetch<GroupType[]>('/grouptypes');
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

  static async getGroupsByGroupType(groupTypeId: number): Promise<Group[]> {
    return this.fetch<Group[]>(`/grouptypes/${groupTypeId}/groups`);
  }

  static async getGroupsByGroupTypeAndLocalId(
    groupTypeId: number,
    localId: string,
  ): Promise<Group[]> {
    return this.fetch<Group[]>(`/grouptypes/${groupTypeId}/groups/${localId}`);
  }
}
