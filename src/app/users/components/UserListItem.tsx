/*
 * UserListItem: Individual user entry component with group information
 *
 * Dependencies:
 * - useUserGroups: Fetches group data for each user
 * - User type: Core user data structure
 */

'use client';

// React/Next.js
import React from 'react';

// Components
import { Checkbox } from '@/components/ui/checkbox';

// Hooks
import { useUserGroups } from '../hooks/useUserGroups';

// Types
import { User } from '@/types/user';

const groupTypes = [
  { id: 1, name: 'System', colorVar: '--group-system-color' },
  { id: 3, name: 'Role', colorVar: '--group-role-color' },
  { id: 4, name: 'ECommerce', colorVar: '--group-ecommerce-color' },
  { id: 5, name: 'Channel', colorVar: '--group-channel-color' },
  { id: 2, name: 'Customer', colorVar: '--group-customer-color' },
] as const;

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
    <>
      <article
        className='p-4 grid grid-cols-2 gap-4'
        aria-label={`User ${user.firstname} ${user.lastname}`}
      >
        <div className='space-y-1'>
          <h3 className='font-bold'>
            <span className='sr-only'>Name: </span>
            {user.firstname} {user.lastname}
          </h3>
          <dl>
            <div>
              <dt className='sr-only'>Email: </dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt className='sr-only'>Country: </dt>
              <dd>{user.country || 'No country specified'}</dd>
            </div>
            <div className='text-gray-400 text-sm'>
              <dt className='sr-only'>Object Identifier: </dt>
              <dd>OID: {user.oid}</dd>
            </div>
          </dl>
        </div>
        <div>
          {groupsLoading ? (
            <div role='status' aria-busy='true' aria-live='polite'>
              Loading groups...
            </div>
          ) : (
            <div className='space-y-2'>
              {groups && groups.length > 0 ? (
                <div
                  className='flex flex-wrap gap-2'
                  role='group'
                  aria-label={`Groups for ${user.firstname} ${user.lastname}`}
                >
                  {groups.map(group => {
                    const type = groupTypes.find(t => t.id === group.typeid);
                    if (!type) return null;

                    return (
                      <label
                        key={group.id}
                        className='flex items-center gap-2 text-sm px-2 py-1 rounded cursor-pointer hover:bg-gray-50'
                      >
                        <Checkbox
                          checked={true}
                          style={
                            {
                              '--checkbox-color': `var(${type.colorVar})`,
                            } as React.CSSProperties
                          }
                          className='border-[var(--checkbox-color)] data-[state=checked]:bg-[var(--checkbox-color)] data-[state=checked]:border-[var(--checkbox-color)]'
                          aria-label={`Toggle ${group.name} group`}
                        />
                        {group.name}
                      </label>
                    );
                  })}
                </div>
              ) : (
                <p
                  className='text-gray-500 text-sm'
                  aria-label='No groups assigned'
                >
                  No groups
                </p>
              )}
            </div>
          )}
        </div>
      </article>
    </>
  );
}
