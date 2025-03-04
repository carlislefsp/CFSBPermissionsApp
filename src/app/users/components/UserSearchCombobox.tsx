/*
 * UserSearchCombobox: Searchable dropdown for user selection
 *
 * Dependencies:
 * - shadcn/ui components (Command, Popover)
 * - lucide-react icons
 */

'use client';

import * as React from 'react';
import { Check, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { User } from '@/types/user';
import { useDebounce } from '@/hooks/useDebounce';

interface UserSearchComboboxProps {
  users: User[];
  onSelect: (user: User | undefined) => void;
  onFilter: (filtered: User[], searchTerm?: string) => void;
  showKeyboardHint?: boolean;
  resetTrigger?: number;
  disabled?: boolean;
}

/**
 * Advanced searchable combobox for user selection with keyboard navigation
 *
 * Features:
 * - Real-time search filtering
 * - Keyboard navigation support
 * - Mobile-responsive design
 * - Optional keyboard shortcut hints
 * - Clear selection capability
 * - Empty state handling
 *
 * Keyboard Support:
 * - '/' : Focus search (when enabled)
 * - 'Arrow Up/Down' : Navigate options
 * - 'Enter' : Select option
 * - 'Esc' : Close dropdown
 *
 * @param props.users - Array of all available users to search through
 * @param props.onSelect - Callback when a user is selected from the dropdown
 * @param props.onFilter - Callback with filtered users and current search term
 * @param props.showKeyboardHint - Whether to show keyboard shortcut hint (default: true)
 * @param props.resetTrigger - External trigger to reset the combobox
 *
 * @example
 * ```tsx
 * <UserSearchCombobox
 *   users={users}
 *   onSelect={(user) => setSelectedUser(user)}
 *   onFilter={(filtered, term) => handleFilteredResults(filtered, term)}
 *   showKeyboardHint={!isMobile}
 *   resetTrigger={resetTrigger}
 * />
 * ```
 */
export function UserSearchCombobox({
  users,
  onSelect,
  onFilter,
  showKeyboardHint = true,
  resetTrigger = 0,
  disabled = false,
}: UserSearchComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Add effect to handle external reset trigger
  React.useEffect(() => {
    if (resetTrigger > 0) {
      setValue('');
      setSearchQuery('');
      setOpen(false);
    }
  }, [resetTrigger]);

  // Only filter users for the dropdown
  const dropdownFilteredUsers = React.useMemo(() => {
    if (!debouncedSearchQuery || debouncedSearchQuery.length < 3) return [];

    return users
      .filter(
        user =>
          user.email
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) ||
          user.firstname
            ?.toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) ||
          user.lastname
            ?.toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()),
      )
      .slice(0, 50);
  }, [users, debouncedSearchQuery]);

  // Handle search submission
  const handleSearch = React.useCallback(() => {
    if (searchQuery.length >= 3) {
      const searchResults = users.filter(
        user =>
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.firstname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.lastname?.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      onFilter(searchResults, searchQuery);
      setOpen(false);
    } else {
      onFilter(users, '');
    }
  }, [users, searchQuery, onFilter]);

  // Batch state updates in a single callback
  const handleSelect = React.useCallback(
    (user: User) => {
      setValue(user.oid);
      onSelect(user);
      setSearchQuery('');
      setOpen(false);
    },
    [onSelect],
  );

  // Reset active index when filtered users change
  React.useEffect(() => {
    setActiveIndex(-1);
  }, [dropdownFilteredUsers]);

  // Handle keyboard navigation
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) return;

      // Prevent any modified keystrokes
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex(prev =>
            prev < dropdownFilteredUsers.length - 1 ? prev + 1 : prev,
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
          break;
        case 'Enter':
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < dropdownFilteredUsers.length) {
            handleSelect(dropdownFilteredUsers[activeIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setOpen(false);
          break;
      }
    },
    [open, dropdownFilteredUsers, activeIndex, handleSelect],
  );

  // Pre-render the Command component
  const commandComponent = React.useMemo(
    () => (
      <Command
        shouldFilter={false}
        className='rounded-lg'
        onKeyDown={e => {
          // Handle search on Enter (only if no item is selected)
          if (
            e.key === 'Enter' &&
            activeIndex === -1 &&
            !e.altKey &&
            !e.ctrlKey &&
            !e.metaKey &&
            !e.shiftKey
          ) {
            e.preventDefault();
            e.stopPropagation();
            handleSearch();
          }
          handleKeyDown(e);
        }}
      >
        <CommandInput
          placeholder='Type at least 3 characters and press Enter to search...'
          onValueChange={value => {
            setSearchQuery(value);
          }}
          value={searchQuery}
        />
        <CommandList>
          {searchQuery.length > 0 && searchQuery.length < 3 && (
            <div className='px-2 py-3 text-sm text-muted-foreground'>
              Type at least 3 characters to search...
            </div>
          )}
          {searchQuery.length >= 3 && (
            <div className='px-2 py-3 text-sm text-muted-foreground border-b'>
              Press{' '}
              <kbd className='px-1.5 py-0.5 text-xs border rounded-md bg-muted'>
                Enter
              </kbd>{' '}
              to add the keyboard{' '}
              <span className='font-bold'>&ldquo;{searchQuery}&rdquo;</span>
              to the results
              {dropdownFilteredUsers.length > 0 && (
                <>
                  ,<br />
                  or select a specific user from the results below
                </>
              )}
            </div>
          )}
          {debouncedSearchQuery.length < 3 ? (
            <CommandEmpty>
              Type at least 3 characters and press Enter to search...
            </CommandEmpty>
          ) : dropdownFilteredUsers.length === 0 ? (
            <CommandEmpty>No users found.</CommandEmpty>
          ) : (
            <CommandGroup>
              {dropdownFilteredUsers.map((user, index) => (
                <CommandItem
                  key={user.oid}
                  value={user.email}
                  onSelect={() => handleSelect(user)}
                  className={cn(
                    activeIndex === index && 'bg-accent',
                    'cursor-pointer',
                  )}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === user.oid ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <div className='flex flex-col'>
                    <span>{user.email}</span>
                    {user.firstname && user.lastname && (
                      <span className='text-sm text-muted-foreground'>
                        {user.firstname} {user.lastname}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    ),
    [
      dropdownFilteredUsers,
      handleSelect,
      searchQuery,
      value,
      debouncedSearchQuery,
      activeIndex,
      handleKeyDown,
      handleSearch,
    ],
  );

  return (
    <div className='flex flex-col'>
      <div className='flex gap-2'>
        <div className='w-auto relative'>
          {open && (
            <div
              className='fixed inset-0 bg-black/30 backdrop-blur-sm z-40'
              aria-hidden='true'
            />
          )}
          <Popover open={open && !disabled} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                role='combobox'
                aria-expanded={open}
                disabled={disabled}
                className='w-[300px] justify-between relative'
              >
                <Search className='h-4 w-4 shrink-0 opacity-50' />
                <span className='ml-2 truncate flex-1 text-left'>
                  {searchQuery || 'Search users...'}
                </span>
                {showKeyboardHint && (
                  <kbd className='pointer-events-none ml-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex'>
                    /
                  </kbd>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[400px] p-0' align='start'>
              {commandComponent}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
