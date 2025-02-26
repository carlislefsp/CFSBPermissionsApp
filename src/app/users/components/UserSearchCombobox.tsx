/*
 * UserSearchCombobox: Searchable dropdown for user selection
 *
 * Dependencies:
 * - shadcn/ui components (Command, Popover)
 * - lucide-react icons
 */

'use client';

import * as React from 'react';
import { Check, X, Search } from 'lucide-react';
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
}

/**
 * A searchable combobox component for selecting users
 * @param props.users - Array of users to display in the dropdown
 * @param props.onSelect - Callback fired when a user is selected
 * @param props.onFilter - Callback fired when users are filtered
 * @param props.showKeyboardHint - Whether to show the keyboard shortcut hint
 */
export function UserSearchCombobox({
  users,
  onSelect,
  onFilter,
  showKeyboardHint = true,
}: UserSearchComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

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
    console.log('Search triggered with query:', searchQuery);

    if (searchQuery.length >= 3) {
      const searchResults = users.filter(
        user =>
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.firstname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.lastname?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      console.log('Found results:', searchResults.length);
      console.log('Calling onFilter with results');
      onFilter(searchResults, searchQuery);
      setOpen(false);
    } else {
      console.log('Query too short, showing all users');
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

  const handleReset = React.useCallback(() => {
    setValue('');
    setSearchQuery('');
    onSelect(undefined);
    onFilter(users, ''); // Reset to show all users
    setOpen(false);
  }, [onSelect, onFilter, users]);

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
            console.log('Enter key pressed in Command');
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
            console.log('Search value changed:', value);
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
      handleSearch,
      users,
      onFilter,
      activeIndex,
      handleKeyDown,
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
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                role='combobox'
                aria-expanded={open}
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
            <PopoverContent className='w-[300px] p-0' align='start'>
              {commandComponent}
            </PopoverContent>
          </Popover>
        </div>
        {value && (
          <Button
            variant='ghost'
            size='icon'
            onClick={handleReset}
            className='h-10 w-10'
            aria-label='Clear search'
          >
            <X className='h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  );
}
