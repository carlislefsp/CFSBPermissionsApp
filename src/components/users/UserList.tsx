'use client';

import { useUsers } from '@/hooks/useUsers';

export function UserList() {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error loading users: {error.message}</div>;
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>User List</h2>
        <div>{users?.length ?? 0} users</div>
      </div>
      <div className='border rounded-lg divide-y'>
        {users?.map(user => (
          <div key={user.oid} className='p-4'>
            <div className='font-medium'>
              {user.firstname} {user.lastname}
              <span className='text-gray-500 ml-2'>({user.username})</span>
            </div>
            <div className='text-sm text-gray-500'>{user.email}</div>
            {user.groups && user.groups.length > 0 && (
              <div className='text-sm text-gray-500 mt-1'>
                Groups: {user.groups.map(g => g.name).join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
