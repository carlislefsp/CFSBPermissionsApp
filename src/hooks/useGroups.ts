'use client';

import { useQuery } from '@tanstack/react-query';
import { Group } from '@/types/group';

export function useGroups() {
  return useQuery<Group[]>({
    queryKey: ['groups'],
    queryFn: async () => {
      const response = await fetch('/api/groups');
      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }
      return response.json();
    },
  });
}
