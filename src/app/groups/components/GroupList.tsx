'use client';

import { useGroups } from '../hooks/useGroups';

export function GroupList() {
  const { data: groups, isLoading, error } = useGroups();

  if (isLoading) {
    return <div>Loading groups...</div>;
  }

  if (error) {
    return <div>Error loading groups: {error.message}</div>;
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>Group List</h2>
        <div>{groups?.length ?? 0} groups</div>
      </div>
      <div className='border rounded-lg divide-y'>
        {groups?.map(group => (
          <div key={group.id} className='p-4'>
            <div className='font-medium'>{group.name}</div>
            <div className='text-sm text-gray-500'>
              Type: {group.typename || 'N/A'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
