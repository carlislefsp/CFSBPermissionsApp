/*
 * UserList: Main user listing component with virtualized loading
 *
 * Dependencies:
 * - useUsers: Fetches user data with React Query
 * - useInView: Handles intersection observer for lazy loading
 * - UserListItem: Renders individual user entries
 * - useDevice: Detects device type for conditional keyboard hints
 */

'use client';

// React/Next.js
import { useInView } from 'react-intersection-observer';
import { useMemo, useEffect, useRef, useCallback } from 'react';

// Components
import { UserListItem, UserListItemPlaceholder } from '.';
import { UserSearchCombobox } from './UserSearchCombobox';
import { Badge } from '@/components/ui/badge';
import { X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Hooks
import { useUsers } from '../hooks/useUsers';
import { useDevice } from '@/hooks/useDevice';
import { useUserValidation } from '../hooks/useUserValidation';

// Types
import { LazyUserListItemProps, UserListProps } from '../types';

/**
 * Main component for displaying and managing the list of users with search, filtering, and lazy loading
 *
 * Features:
 * - Virtualized lazy loading of user items
 * - Search functionality with multi-term support
 * - Tab-based filtering between customers and employees
 * - Keyboard shortcuts for common actions
 * - Responsive design with mobile considerations
 *
 * Keyboard Shortcuts:
 * - '/' : Focus search
 * - 'Esc' : Clear selection
 * - 'Ctrl+R' (Mac) or 'Alt+R' (Windows) : Reset all filters
 *
 * @param props.filterFn - Optional function to filter users beyond search/tab filters
 * @param props.currentTab - Current active tab ('customers' | 'employees')
 * @param props.onTabChange - Callback when switching between customer/employee tabs
 * @param props.allUsers - Pre-filtered users separated by customer/employee status
 * @param props.selectedUser - Currently selected user for detailed view
 * @param props.onSelectUser - Callback when user selection changes
 * @param props.searchFilteredUsers - Users filtered by current search terms
 * @param props.searchTerms - Array of active search terms with their IDs
 * @param props.onSearch - Callback when search is performed
 * @param props.onRemoveSearchTerm - Callback to remove a specific search term
 *
 * @example
 * ```tsx
 * <UserList
 *   currentTab="customers"
 *   onTabChange={(tab) => setCurrentTab(tab)}
 *   allUsers={{ customers: [], employees: [] }}
 *   selectedUser={selectedUser}
 *   onSelectUser={(user) => setSelectedUser(user)}
 *   searchTerms={[]}
 *   onSearch={(users, term) => handleSearch(users, term)}
 *   onRemoveSearchTerm={(id) => removeSearchTerm(id)}
 * />
 * ```
 */
export function UserList({
  filterFn,
  currentTab,
  onTabChange,
  allUsers,
  selectedUser,
  onSelectUser,
  searchFilteredUsers,
  searchTerms,
  onSearch,
  onRemoveSearchTerm,
}: UserListProps) {
  const { data: users = [], isLoading, error } = useUsers();
  const searchRef = useRef<HTMLDivElement>(null);
  const { isMobile, isMac } = useDevice();

  // Get user groups for validation
  const userGroups = useMemo(() => {
    const groupMap = new Map();
    users.forEach(user => {
      groupMap.set(user.oid, user.groups || []);
    });
    return groupMap;
  }, [users]);

  // Get violations for all users
  const violations = useUserValidation(users, userGroups);

  // Add reset handler
  const handleReset = useCallback(() => {
    onSelectUser(undefined);
    onSearch([], '');
    // Remove all search terms
    searchTerms.forEach(term => onRemoveSearchTerm(term.id));
  }, [onSelectUser, onSearch, searchTerms, onRemoveSearchTerm]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log('Key pressed:', {
        key: e.key,
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        shiftKey: e.shiftKey,
        target: e.target instanceof HTMLElement ? e.target.tagName : 'unknown',
      });

      // Ignore shortcuts when typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        console.log('Ignoring shortcut - typing in input');
        return;
      }

      // Search focus: /
      if (
        e.key === '/' &&
        !e.altKey &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey
      ) {
        console.log('Search focus shortcut triggered');
        e.preventDefault();
        searchRef.current?.querySelector('button')?.click();
      }

      // Reset: Control + R (Mac) or Alt + R (Windows)
      if (
        e.key.toLowerCase() === 'r' &&
        ((navigator.platform.includes('Mac') && e.ctrlKey) ||
          (!navigator.platform.includes('Mac') && e.altKey)) &&
        !e.shiftKey &&
        !e.metaKey &&
        !(navigator.platform.includes('Mac') ? e.altKey : e.ctrlKey)
      ) {
        console.log('Reset shortcut triggered');
        e.preventDefault();
        handleReset();
      }

      // Clear selection: Escape
      if (
        e.key === 'Escape' &&
        !e.altKey &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        selectedUser
      ) {
        console.log('Clear selection shortcut triggered');
        e.preventDefault();
        onSelectUser(undefined);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleReset, onSelectUser, selectedUser]);

  // Apply filters
  const filteredUsers = useMemo(() => {
    console.log('Recalculating filteredUsers:', {
      totalUsers: users.length,
      searchFiltered: searchFilteredUsers.length,
      hasFilterFn: !!filterFn,
      hasSelectedUser: !!selectedUser,
      searchTerms,
    });

    // If we have search terms, apply them to the current tab's users
    if (searchTerms.length > 0 && allUsers && currentTab) {
      const currentTabUsers =
        currentTab === 'customers' ? allUsers.customers : allUsers.employees;
      return currentTabUsers.filter(user =>
        searchTerms.every(({ term }) =>
          [user.email, user.firstname, user.lastname].some(field =>
            field?.toLowerCase().includes(term.toLowerCase()),
          ),
        ),
      );
    }

    // Otherwise, use normal filtering logic
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
  }, [
    users,
    filterFn,
    selectedUser,
    searchFilteredUsers,
    searchTerms,
    allUsers,
    currentTab,
  ]);

  // Calculate matches in other tab when there's an active search
  const otherTabMatches = useMemo(() => {
    if (searchTerms.length === 0 || !currentTab || !allUsers) return [];

    const otherTabUsers =
      currentTab === 'customers' ? allUsers.employees : allUsers.customers;
    return otherTabUsers.filter(user =>
      searchTerms.every(({ term }) =>
        [user.email, user.firstname, user.lastname].some(field =>
          field?.toLowerCase().includes(term.toLowerCase()),
        ),
      ),
    );
  }, [searchTerms, currentTab, allUsers]);

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
      <div className='flex gap-2'>
        <div ref={searchRef} className='contents'>
          <UserSearchCombobox
            users={users}
            onSelect={onSelectUser}
            onFilter={onSearch}
            showKeyboardHint={!isMobile}
          />
        </div>
        <Button
          variant='ghost'
          onClick={handleReset}
          className='h-10 shrink-0 gap-2'
          aria-label='Reset all filters'
          title='Reset all filters'
        >
          <RotateCcw className='h-4 w-4' />
          <span>Reset</span>
          {!isMobile && (
            <kbd className='hidden h-5 select-none items-center rounded border bg-secondary px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex'>
              {isMac ? '⌃R' : 'Alt+R'}
            </kbd>
          )}
        </Button>
      </div>
      <div className='flex flex-wrap items-center gap-2 text-sm text-muted-foreground'>
        {/* Showing x users message */}
        <p className='flex-none'>
          Showing {filteredUsers.length}{' '}
          {filteredUsers.length === 1 ? 'user' : 'users'}
        </p>

        {/* Search term and selected user badges */}
        <div className='flex flex-wrap gap-2'>
          {/* Selected user badge */}
          {selectedUser && (
            <Badge variant='secondary' className='gap-1.5'>
              User: {selectedUser.email}
              <Button
                variant='ghost'
                size='icon'
                className='h-3 w-3 p-0 hover:bg-transparent'
                onClick={() => onSelectUser(undefined)}
              >
                <X className='h-3 w-3' />
                <span className='sr-only'>Clear selected user</span>
              </Button>
            </Badge>
          )}
          {/* Search term badges */}
          {searchTerms.map(term => (
            <Badge key={term.id} variant='secondary' className='gap-1.5'>
              Search: {term.term}
              <Button
                variant='ghost'
                size='icon'
                className='h-3 w-3 p-0 hover:bg-transparent'
                onClick={() => onRemoveSearchTerm(term.id)}
              >
                <X className='h-3 w-3' />
                <span className='sr-only'>Remove search term</span>
              </Button>
            </Badge>
          ))}
        </div>

        {/* Selected user in other tab message */}
        {selectedUser && currentTab && allUsers && (
          <>
            {currentTab === 'customers' &&
              allUsers.employees.some(u => u.oid === selectedUser.oid) && (
                <div className='flex items-center gap-2 rounded-md bg-muted px-3 py-1'>
                  <span>Selected user found in Employees</span>
                  {onTabChange && (
                    <Button
                      variant='link'
                      className='h-auto p-0'
                      onClick={() => onTabChange('employees')}
                    >
                      Switch tab →
                    </Button>
                  )}
                </div>
              )}
            {currentTab === 'employees' &&
              allUsers.customers.some(u => u.oid === selectedUser.oid) && (
                <div className='flex items-center gap-2 rounded-md bg-muted px-3 py-1'>
                  <span>Selected user found in Customers</span>
                  {onTabChange && (
                    <Button
                      variant='link'
                      className='h-auto p-0'
                      onClick={() => onTabChange('customers')}
                    >
                      Switch tab →
                    </Button>
                  )}
                </div>
              )}
          </>
        )}

        {/* Search results in other tab message */}
        {searchTerms.length > 0 &&
          otherTabMatches.length > 0 &&
          currentTab &&
          onTabChange && (
            <div className='flex items-center gap-2 rounded-md bg-muted px-3 py-1'>
              <span>
                {otherTabMatches.length}{' '}
                {otherTabMatches.length === 1 ? 'match' : 'matches'} in{' '}
                {currentTab === 'customers' ? 'Employees' : 'Customers'}
              </span>
              <Button
                variant='link'
                className='h-auto p-0'
                onClick={() =>
                  onTabChange(
                    currentTab === 'customers' ? 'employees' : 'customers',
                  )
                }
              >
                Switch tab →
              </Button>
            </div>
          )}
      </div>
      <ul
        className='space-y-2 border rounded-lg divide-y'
        role='list'
        aria-label='User list'
      >
        {filteredUsers.map(user => (
          <LazyUserListItem
            key={user.oid}
            user={user}
            violations={violations.get(user.oid)?.violations || []}
          />
        ))}
      </ul>
    </div>
  );
}

/**
 * Component that implements lazy loading for individual user list items
 * Only renders the full UserListItem component when the element enters the viewport
 *
 * Features:
 * - Uses Intersection Observer for viewport detection
 * - Shows placeholder while loading
 * - Triggers load once with 10% visibility threshold
 *
 * @param props.user - User object containing profile and permission information
 *
 * @example
 * ```tsx
 * <LazyUserListItem user={{
 *   oid: '123',
 *   email: 'user@example.com',
 *   firstname: 'John',
 *   lastname: 'Doe'
 * }} />
 * ```
 */
function LazyUserListItem({ user, violations }: LazyUserListItemProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <li ref={ref} className='border-b last:border-b-0' role='listitem'>
      {inView ? (
        <UserListItem user={user} violations={violations} />
      ) : (
        <UserListItemPlaceholder />
      )}
    </li>
  );
}
