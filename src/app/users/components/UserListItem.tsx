/*
 * UserListItem: Individual user entry component with group information
 *
 * Dependencies:
 * - useUserGroups: Fetches group data for each user
 * - User type: Core user data structure
 */

'use client';

// Hooks
import { useUserGroups } from '../hooks/useUserGroups';

// Types
import { User } from '@/types/user';

export interface UserListItemProps {
  user: User;
}

/**
 * Displays detailed information about a user including their groups
 * Implements lazy loading for group data using React Query
 * @param props.user - User object containing profile information
 */
export function UserListItem({ user }: UserListItemProps) {
  const { data: groups = [], isLoading: groupsLoading } = useUserGroups(
    user.oid,
    {
      enabled: true,
    },
  );

  return (
    <div
      className='p-4 grid grid-cols-2 gap-4'
      aria-label={`User ${user.firstname} ${user.lastname}`}
    >
      <div className='space-y-1'>
        <div className='font-bold'>
          <span className='sr-only'>Name: </span>
          {user.firstname} {user.lastname}
        </div>
        <div>
          <span className='sr-only'>Email: </span>
          {user.email}
        </div>
        <div>
          <span className='sr-only'>Country: </span>
          {user.country || 'No country specified'}
        </div>
        <div className='text-gray-400 text-sm'>
          <span className='sr-only'>User ID: </span>
          OID: {user.oid}
        </div>
      </div>
      <div>
        {groupsLoading ? (
          <div role='status' aria-busy='true' aria-live='polite'>
            Loading groups...
          </div>
        ) : (
          <div className='space-y-1'>
            {groups && groups.length > 0 ? (
              <div
                className='flex flex-wrap gap-2'
                role='group'
                aria-label={`Groups for ${user.firstname} ${user.lastname}`}
              >
                {groups.map(group => (
                  <div
                    key={group.id}
                    className='text-sm bg-gray-100 px-2 py-1 rounded'
                  >
                    {group.name}
                  </div>
                ))}
              </div>
            ) : (
              <div
                className='text-gray-500 text-sm'
                aria-label='No groups assigned'
              >
                No groups
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
