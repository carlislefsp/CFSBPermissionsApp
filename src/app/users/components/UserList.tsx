/*
 * UserList: Main user listing component with virtualized loading
 *
 * Dependencies:
 * - useUsers: Fetches user data with React Query
 * - useInView: Handles intersection observer for lazy loading
 * - UserListItem: Renders individual user entries
 */

'use client';

// React/Next.js
import { useInView } from 'react-intersection-observer';

// Components
import { UserListItem, UserListItemPlaceholder } from '.';

// Hooks
import { useUsers } from '../hooks/useUsers';

// Types
import { User } from '@/types/user';

interface LazyUserListItemProps {
  user: User;
}

/**
 * Displays a paginated list of users with their information
 * Implements lazy loading for both list items and their associated groups
 */
export function UserList() {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading)
    return (
      <div role='status' aria-busy='true' aria-label='Loading users'>
        Loading users...
      </div>
    );
  if (error)
    return (
      <div role='alert' className='text-red-600'>
        Error loading users: {error.message}
      </div>
    );

  return (
    <div className='space-y-4'>
      <div className='flex'>
        <h2 role='status' aria-live='polite' aria-label='Total number of users'>
          {users?.length ?? 0} users
        </h2>
      </div>
      <ul className='border rounded-lg' role='list' aria-label='User list'>
        {users?.map(user => (
          <LazyUserListItem key={user.oid} user={user} />
        ))}
      </ul>
    </div>
  );
}

/**
 * Wrapper component that implements lazy loading for user list items
 * Only renders the full item when it comes into view
 * @param props.user - User object containing profile information
 */
function LazyUserListItem({ user }: LazyUserListItemProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <li ref={ref} className='border-b last:border-b-0' role='listitem'>
      {inView ? <UserListItem user={user} /> : <UserListItemPlaceholder />}
    </li>
  );
}
