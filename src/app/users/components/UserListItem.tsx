/*
 * UserListItem: Individual user entry component with group management
 *
 * Dependencies:
 * - useUserGroups: Fetches and manages group data for each user
 * - UserGroupList: Group list component
 * - UserGroupDialog: Mobile dialog component
 * - UserGroupHeader: User info header component
 * - Shadcn UI: Button component
 */

'use client';

// React/Next.js
import React from 'react';

// Components
import { Button } from '@/components/ui/button';
import { Pencil, X } from 'lucide-react';
import { UserGroupList } from './UserGroupList';
import { UserGroupDialog } from './UserGroupDialog';

// Hooks
import { useUserGroups } from '../hooks/useUserGroups';

// Types
import { User } from '@/types/user';

export interface UserListItemProps {
  user: User;
}

/**
 * Displays detailed user information with editable group assignments
 * Implements responsive design with different layouts for mobile/desktop
 * Features:
 * - Lazy loading of group data
 * - Collapsible group list with overflow detection
 * - Mobile-optimized dialog for group management
 *
 * @param props.user - User object containing profile information and OID
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

  // Set hasOverflow based on group count instead of container dimensions
  React.useEffect(() => {
    setHasOverflow(groups.length > 10);
  }, [groups]);

  const renderClosedView = () => {
    const totalGroups = groups.length;
    const groupsText = totalGroups === 1 ? 'group' : 'groups';

    return (
      <div className='flex items-start gap-2 sm:gap-4'>
        <div className='flex-1 min-w-0'>
          <div
            ref={groupsContainerRef}
            className='flex flex-wrap mb-1 gap-1.5 sm:gap-2'
          >
            <UserGroupList groups={groups} variant='desktop' isClosedView />
            {hasOverflow && (
              <Button
                onClick={() => setIsOpen(true)}
                className='bg-secondary text-secondary-foreground '
                variant='secondary'
                size='sm'
              >
                ... View all {totalGroups} {groupsText}
              </Button>
            )}
          </div>
        </div>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => setIsOpen(true)}
          className='flex-shrink-0 h-10 w-10 bg-muted/40 sm:bg-transparent sm:w-auto sm:h-auto sm:hover:bg-muted/40'
        >
          <Pencil className='h-5 w-5 sm:h-4 sm:w-4' />
          <span className='sr-only'>Edit groups</span>
        </Button>
      </div>
    );
  };

  const renderOpenView = () => (
    <div className='flex items-start gap-2 sm:gap-4'>
      <div
        className='space-y-3 overflow-y-auto'
        role='group'
        aria-label={`Groups for ${user.firstname} ${user.lastname}`}
      >
        <UserGroupList groups={groups} variant='desktop' />
      </div>
      <Button
        variant='ghost'
        size='icon'
        onClick={() => setIsOpen(false)}
        className='flex-shrink-0 h-10 w-10 bg-muted/40'
      >
        <X className='h-6 w-6' />
        <span className='sr-only'>Close groups editor</span>
      </Button>
    </div>
  );

  return (
    <>
      <article
        className='p-4 grid grid-cols-1 gap-4 sm:grid-cols-[minmax(280px,340px)_1fr] sm:gap-4'
        aria-label={`User ${user.firstname} ${user.lastname}`}
      >
        <div className='space-y-1 min-w-0'>
          <h3 className='font-bold truncate'>
            <span className='sr-only'>Name: </span>
            {user.firstname} {user.lastname}
          </h3>
          <dl className='space-y-0.5'>
            <div>
              <dt className='sr-only'>Email: </dt>
              <dd className='truncate'>{user.email}</dd>
            </div>
            <div>
              <dt className='sr-only'>Country: </dt>
              <dd className='truncate'>
                {user.country || 'No country specified'}
              </dd>
            </div>
            <div className='text-gray-400 text-sm'>
              <dt className='sr-only'>User Object Identifier: </dt>
              <dd className='truncate'> {user.oid}</dd>
            </div>
          </dl>
          {/* Mobile View Groups Button */}
          {groups && groups.length > 0 && (
            <Button
              variant='secondary'
              size='sm'
              onClick={() => setIsOpen(true)}
              className='mt-2 sm:hidden w-full justify-start gap-2'
            >
              <Pencil className='h-4 w-4' />
              View {groups.length} {groups.length === 1 ? 'group' : 'groups'}
            </Button>
          )}
        </div>
        {/* Desktop Groups View */}
        <div className='hidden sm:block min-w-0'>
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
      {/* Mobile Groups Dialog */}
      {isOpen && groups && groups.length > 0 && (
        <UserGroupDialog
          user={user}
          groups={groups}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
