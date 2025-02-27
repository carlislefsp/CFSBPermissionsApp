'use client';

import { useQuery } from '@tanstack/react-query';
import { Group } from '@/types/group';

interface UseUserGroupsOptions {
  enabled?: boolean;
}

export function useUserGroups(
  userId: string,
  options: UseUserGroupsOptions = {},
) {
  return useQuery<Group[]>({
    queryKey: ['userGroups', userId],
    queryFn: async () => {
      console.log('Fetching groups for user:', userId);
      const response = await fetch(`/api/users/${userId}/groups`);
      if (!response.ok) {
        console.error(
          'Failed to fetch groups:',
          response.status,
          response.statusText,
        );
        throw new Error('Failed to fetch user groups');
      }
      const groups = await response.json();
      console.log('Received groups:', groups);
      return groups;
    },
    enabled: options.enabled && !!userId,
    staleTime: 1000 * 60 * 30, // Data considered fresh for 30 minutes
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
  });
}
