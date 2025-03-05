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
      <DialogContent className='h-[100dvh] overflow-y-auto p-0 sm:h-auto sm:p-6'>
        <DialogHeader className='p-4 sm:p-0'>
          <DialogTitle>
            Groups for {user.firstname} {user.lastname}
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4 p-4 sm:p-0'>
          {/* Rule Violations Banner */}
          {violations.length > 0 && (
            <div className='border-t'>
              {violations.map(violation => (
                <div
                  key={violation.ruleId}
                  className='p-2 bg-destructive/10 text-destructive rounded-md text-sm'
                >
                  <strong>{violation.ruleName}:</strong> {violation.message}
                </div>
              ))}
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
