'use client';

import { useQuery } from '@tanstack/react-query';
import { Group } from '@/types/group';

export function useUserGroupsMapping() {
  return useQuery<Record<string, Group[]>>({
    queryKey: ['userGroupsMapping'],
    queryFn: async () => {
      const response = await fetch('/api/user-groups');
      if (!response.ok) {
        throw new Error('Failed to fetch user groups mapping');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 30, // Consider data fresh for 30 minutes
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
  });
}

// Helper hook to get groups for a specific user from the mapping
export function useUserGroups(userId: string) {
  const { data: mapping, isLoading, error } = useUserGroupsMapping();

  return {
    data: mapping?.[userId] || [],
    isLoading,
    error,
  };
}
