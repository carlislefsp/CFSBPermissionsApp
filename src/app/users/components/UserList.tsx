'use client';

import { useUsers } from '../hooks/useUsers';

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
            <div className='font-medium'>{user.username}</div>
            <div className='text-sm text-gray-500'>{user.email}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
