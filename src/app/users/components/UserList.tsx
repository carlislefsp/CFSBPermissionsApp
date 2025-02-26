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
import { useState, useMemo } from 'react';

// Components
import { UserListItem, UserListItemPlaceholder } from '.';
import { UserSearchCombobox } from './UserSearchCombobox';

// Hooks
import { useUsers } from '../hooks/useUsers';

// Types
import { User } from '@/types/user';

interface LazyUserListItemProps {
  user: User;
}

interface UserListProps {
  filterFn?: (user: User) => boolean;
}

/**
 * Displays a paginated list of users with their information
 * Implements lazy loading for both list items and their associated groups
 * @param props.filterFn - Optional function to filter users
 */
export function UserList({ filterFn }: UserListProps) {
  const { data: users = [], isLoading, error } = useUsers();
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [searchFilteredUsers, setSearchFilteredUsers] = useState<User[]>([]);

  // Apply filters
  const filteredUsers = useMemo(() => {
    console.log('Recalculating filteredUsers:', {
      totalUsers: users.length,
      searchFiltered: searchFilteredUsers.length,
      hasFilterFn: !!filterFn,
      hasSelectedUser: !!selectedUser,
    });

    // Start with search results if available, otherwise use all users
    let result = searchFilteredUsers.length > 0 ? searchFilteredUsers : users;

    // Then apply filterFn if provided
    if (filterFn) {
      result = result.filter(filterFn);
    }

    // Finally, filter by selected user if any
    if (selectedUser) {
      result = result.filter(user => user.oid === selectedUser.oid);
    }

    console.log('Final filtered results:', result.length);
    return result;
  }, [users, filterFn, selectedUser, searchFilteredUsers]);

  const handleSearchFilter = (filtered: User[]) => {
    console.log('Search filter called with:', filtered.length, 'results');
    setSearchFilteredUsers(filtered);
  };

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
      <UserSearchCombobox
        users={users}
        onSelect={setSelectedUser}
        onFilter={handleSearchFilter}
      />
      <div className='flex text-sm text-muted-foreground'>
        <p>
          Showing {filteredUsers.length}{' '}
          {filteredUsers.length === 1 ? 'user' : 'users'}
        </p>
      </div>
      <ul className='border rounded-lg' role='list' aria-label='User list'>
        {filteredUsers.map(user => (
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
