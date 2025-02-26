/*
 * UserGroupList: Displays a categorized list of user groups with responsive layout
 *
 * Dependencies:
 * - Shadcn UI: Checkbox component
 * - Group types and styling
 */

'use client';

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Group } from '@/types/group';

// Constants
const groupTypes = [
  { id: 1, name: 'System', colorVar: '--group-system-color' },
  { id: 3, name: 'Role', colorVar: '--group-role-color' },
  { id: 4, name: 'ECommerce', colorVar: '--group-ecommerce-color' },
  { id: 5, name: 'Channel', colorVar: '--group-channel-color' },
  { id: 2, name: 'Customer', colorVar: '--group-customer-color' },
] as const;

interface UserGroupListProps {
  groups: Group[];
  variant: 'mobile' | 'desktop';
  isClosedView?: boolean;
}

/**
 * Renders a list of user groups organized by type with responsive layout
 * @param props.groups - Array of groups assigned to the user
 * @param props.variant - Display variant ('mobile' | 'desktop') controlling layout and styling
 * @param props.isClosedView - Whether this is the closed view on desktop (shows inline groups)
 */
export function UserGroupList({
  groups,
  variant,
  isClosedView,
}: UserGroupListProps) {
  // For desktop closed view, we want to show all groups in a single line but maintain type ordering
  if (variant === 'desktop' && isClosedView) {
    const orderedGroups = groupTypes.reduce<Group[]>((acc, type) => {
      const typeGroups = groups.filter(group => group.typeid === type.id);
      return [...acc, ...typeGroups];
    }, []);

    // Limit to first 10 groups in closed view
    const displayGroups = orderedGroups.slice(0, 12);

    return (
      <div className='flex flex-wrap gap-1.5'>
        {displayGroups.map(group => {
          const type = groupTypes.find(t => t.id === group.typeid);
          if (!type) return null;

          return (
            <label
              key={group.id}
              className='flex items-center gap-1.5 text-sm rounded-md cursor-pointer px-1.5 h-7 bg-muted hover:bg-muted/80'
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
              <span>{group.name}</span>
            </label>
          );
        })}
      </div>
    );
  }

  // Regular view with categories
  return (
    <div className='space-y-4'>
      {groupTypes.map(type => {
        const typeGroups = groups.filter(group => group.typeid === type.id);
        if (typeGroups.length === 0) return null;

        return (
          <div key={type.id} className='space-y-2'>
            <h4
              className={`text-xs font-medium text-muted-foreground ${
                variant === 'desktop' ? 'static' : 'sticky top-[-1rem]'
              } bg-background -mx-4 px-4 py-1 -mt-1`}
            >
              {type.name}
            </h4>
            <div
              className={
                variant === 'desktop'
                  ? 'flex flex-wrap gap-1.5'
                  : 'flex flex-col'
              }
            >
              {typeGroups.map(group => (
                <label
                  key={group.id}
                  className={`flex items-center gap-1.5 text-sm rounded-md cursor-pointer h-7 ${
                    variant === 'desktop'
                      ? 'px-1.5 bg-muted hover:bg-muted/80'
                      : 'px-2 hover:bg-muted'
                  }`}
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
                  <span className={variant === 'desktop' ? '' : 'truncate'}>
                    {group.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
