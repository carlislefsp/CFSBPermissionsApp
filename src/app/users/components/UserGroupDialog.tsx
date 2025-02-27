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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { UserGroupList } from './UserGroupList';
import { User } from '@/types/user';
import { Group } from '@/types/group';

interface UserGroupDialogProps {
  user: User;
  groups: Group[];
  violations?: {
    ruleId: string;
    ruleName: string;
    message: string;
  }[];
  onClose: () => void;
}

/**
 * Mobile-optimized dialog component for managing user group assignments
 *
 * Features:
 * - Full-screen mobile dialog experience
 * - Accessible dialog implementation
 * - Group management interface
 * - Smooth animations and transitions
 * - Touch-friendly controls
 *
 * Accessibility:
 * - Proper ARIA roles and labels
 * - Focus management
 * - Keyboard navigation support
 * - Screen reader announcements
 *
 * @param props.user - User whose groups are being managed
 * @param props.groups - Array of groups assigned to the user
 * @param props.violations - Array of rule violations
 * @param props.onClose - Callback when dialog is closed
 *
 * @example
 * ```tsx
 * <UserGroupDialog
 *   user={{
 *     oid: '123',
 *     email: 'user@example.com',
 *     firstname: 'John',
 *     lastname: 'Doe'
 *   }}
 *   groups={userGroups}
 *   violations={violations}
 *   onClose={() => setDialogOpen(false)}
 * />
 * ```
 */

export function UserGroupDialog({
  user,
  groups,
  violations = [],
  onClose,
}: UserGroupDialogProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Groups for {user.firstname} {user.lastname}
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          {/* Rule Violations Banner */}
          {violations.length > 0 && (
            <div
              className='bg-red-50 border border-red-200 rounded-md p-3 space-y-2'
              role='alert'
            >
              <div className='flex items-center gap-2 text-red-700 font-medium'>
                <div className='rounded-full bg-red-600 text-white p-0.5 w-5 h-5 flex items-center justify-center'>
                  <span className='font-bold text-sm'>!</span>
                </div>
                <span>Problem Found:</span>
              </div>
              <ul className='space-y-1 text-sm text-red-600 list-disc pl-5'>
                {violations.map(violation => (
                  <li key={violation.ruleId}>
                    <strong>{violation.ruleName}:</strong> {violation.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Groups List */}
          <div className='space-y-3'>
            <UserGroupList groups={groups} variant='mobile' />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
