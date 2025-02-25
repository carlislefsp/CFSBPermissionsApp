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
import { Button } from '@/components/ui/button';
import { Pencil, X } from 'lucide-react';

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
  const [isOpen, setIsOpen] = React.useState(false);
  const [hasOverflow, setHasOverflow] = React.useState(false);
  const groupsContainerRef = React.useRef<HTMLDivElement>(null);
  const { data: groups = [], isLoading: groupsLoading } = useUserGroups(
    user.oid,
    {
      enabled: true,
    },
  );

  React.useLayoutEffect(() => {
    if (!groupsContainerRef.current) return;

    const checkOverflow = () => {
      const container = groupsContainerRef.current;
      if (!container) return;

      setHasOverflow(container.scrollHeight > container.clientHeight);
    };

    // Check initially
    checkOverflow();

    // Set up resize observer
    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(groupsContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [groups]); // Re-run when groups change

  const renderClosedView = () => {
    const groupsByType = groupTypes
      .map(type => ({
        type,
        groups: groups.filter(group => group.typeid === type.id),
      }))
      .filter(({ groups }) => groups.length > 0);

    const totalGroups = groups.length;

    return (
      <div className='flex items-start gap-4'>
        <div className='flex-1'>
          <div
            ref={groupsContainerRef}
            className='flex flex-wrap gap-2 h-[5.5rem] overflow-hidden'
          >
            {groupsByType.map(({ type, groups: typeGroups }) => (
              <React.Fragment key={type.id}>
                {typeGroups.map(group => (
                  <label
                    key={group.id}
                    className='flex items-center gap-2 text-sm px-2 h-[1.5rem] rounded bg-muted'
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
                ))}
              </React.Fragment>
            ))}
          </div>
          {hasOverflow && (
            <div className='mt-1 text-sm text-muted-foreground'>
              View all {totalGroups} groups
            </div>
          )}
        </div>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setIsOpen(true)}
          className='flex-shrink-0'
        >
          <Pencil className='h-4 w-4' />
          <span className='sr-only'>Edit groups</span>
        </Button>
      </div>
    );
  };

  const renderOpenView = () => (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <h4 className='text-sm font-medium'>Manage Groups</h4>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setIsOpen(false)}
          className='flex-shrink-0'
        >
          <X className='h-4 w-4' />
          <span className='sr-only'>Close groups editor</span>
        </Button>
      </div>
      <div
        className='space-y-3'
        role='group'
        aria-label={`Groups for ${user.firstname} ${user.lastname}`}
      >
        {groupTypes.map(type => {
          const typeGroups = groups.filter(group => group.typeid === type.id);
          if (typeGroups.length === 0) return null;

          return (
            <div key={type.id} className='space-y-2'>
              <h4 className='text-xs font-medium text-muted-foreground'>
                {type.name}
              </h4>
              <div className='flex flex-wrap gap-2'>
                {typeGroups.map(group => (
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
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <article
        className='p-4 grid grid-cols-[fit-content(300px)_1fr] gap-4'
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
          ) : groups && groups.length > 0 ? (
            isOpen ? (
              renderOpenView()
            ) : (
              renderClosedView()
            )
          ) : (
            <p
              className='text-gray-500 text-sm'
              aria-label='No groups assigned'
            >
              No groups
            </p>
          )}
        </div>
      </article>
    </>
  );
}
