/*
 * UserGroupDialog: Mobile-optimized dialog for managing user groups
 *
 * Dependencies:
 * - UserGroupList: Group list component
 * - UserGroupHeader: User info header component
 * - Shadcn UI: Button component
 */

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { UserGroupList } from './UserGroupList';
import { UserGroupHeader } from './UserGroupHeader';
import { User } from '@/types/user';
import { Group } from '@/types/group';

interface UserGroupDialogProps {
  user: User;
  groups: Group[];
  onClose: () => void;
}

export function UserGroupDialog({
  user,
  groups,
  onClose,
}: UserGroupDialogProps) {
  return (
    <div className='fixed inset-0 z-50 sm:hidden'>
      <div className='fixed inset-4 bg-background rounded-lg shadow-lg border flex flex-col overflow-hidden'>
        <div className='sticky top-0 bg-background p-4 border-b'>
          <div className='flex items-center justify-between gap-2 mb-2'>
            <UserGroupHeader user={user} />
            <Button
              variant='ghost'
              size='icon'
              onClick={onClose}
              className='flex-shrink-0 h-10 w-10 bg-muted/40'
            >
              <X className='h-6 w-6' />
              <span className='sr-only'>Close groups editor</span>
            </Button>
          </div>
          <h4 className='text-sm font-medium'>Manage Groups</h4>
        </div>
        <div className='flex-1 overflow-y-auto p-4'>
          <div className='space-y-4'>
            <UserGroupList groups={groups} variant='mobile' />
          </div>
        </div>
      </div>
      <div className='fixed inset-0 -z-10 bg-background/80 backdrop-blur-sm' />
    </div>
  );
}
