/*
 * UserSearchCombobox: Searchable dropdown for user selection
 *
 * Dependencies:
 * - shadcn/ui components (Command, Popover)
 * - lucide-react icons
 */

'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, X, Search } from 'lucide-react';
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
}

/**
 * A searchable combobox component for selecting users
 * @param props.users - Array of users to display in the dropdown
 * @param props.onSelect - Callback fired when a user is selected
 */
export function UserSearchCombobox({
  users,
  onSelect,
}: UserSearchComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Memoize the selected user to avoid re-renders
  const selectedUser = React.useMemo(
    () => users.find(user => user.oid === value),
    [users, value],
  );

  // Only filter users when there are 3 or more characters
  const filteredUsers = React.useMemo(() => {
    if (!debouncedSearchQuery || debouncedSearchQuery.length < 3) return [];

    const query = debouncedSearchQuery.toLowerCase();
    return users
      .filter(
        user =>
          user.email.toLowerCase().includes(query) ||
          user.firstname?.toLowerCase().includes(query) ||
          user.lastname?.toLowerCase().includes(query),
      )
      .slice(0, 50); // Limit to first 50 matches for performance
  }, [users, debouncedSearchQuery]);

  // Batch state updates in a single callback
  const handleSelect = React.useCallback(
    (user: User) => {
      requestAnimationFrame(() => {
        setValue(user.oid);
        onSelect(user);
        setSearchQuery('');
        setOpen(false);
      });
    },
    [onSelect],
  );

  const handleReset = React.useCallback(() => {
    setValue('');
    setSearchQuery('');
    onSelect(undefined);
  }, [onSelect]);

  // Pre-render the Command component
  const commandComponent = React.useMemo(
    () => (
      <Command shouldFilter={false} className='rounded-lg'>
        <CommandInput
          placeholder='Type at least 3 characters to search...'
          onValueChange={setSearchQuery}
          value={searchQuery}
        />
        <CommandList>
          {debouncedSearchQuery.length < 3 ? (
            <CommandEmpty>Type at least 3 characters to search...</CommandEmpty>
          ) : filteredUsers.length === 0 ? (
            <CommandEmpty>No users found.</CommandEmpty>
          ) : (
            <CommandGroup>
              {filteredUsers.map(user => (
                <CommandItem
                  key={user.oid}
                  value={user.email}
                  onSelect={() => handleSelect(user)}
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
    [filteredUsers, handleSelect, searchQuery, value, debouncedSearchQuery],
  );

  return (
    <div className='flex gap-2'>
      <div className='w-[400px] relative'>
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
              role='button'
              aria-expanded={open}
              className='w-full justify-between h-10'
            >
              <div className='flex items-center gap-2'>
                <Search className='h-4 w-4' />
                <span>Search users...</span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className='w-[--radix-popover-trigger-width] p-0 bg-background border shadow-lg z-50'
            align='start'
            sideOffset={0}
          >
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
  );
}
