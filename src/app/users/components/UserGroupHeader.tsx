/*
 * UserGroupHeader: Displays user's basic information in group management views
 *
 * Dependencies:
 * - User type from types
 */

import React from 'react';
import { User } from '@/types/user';

interface UserGroupHeaderProps {
  user: User;
}

export function UserGroupHeader({ user }: UserGroupHeaderProps) {
  return (
    <div className='min-w-0'>
      <h4 className='text-sm font-medium truncate'>
        {user.firstname} {user.lastname}
      </h4>
      <p className='text-xs text-muted-foreground truncate'>{user.email}</p>
    </div>
  );
}
