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
  onFilter: (users: User[], searchTerm?: string) => void;
  currentTab?: 'customers' | 'employees';
  onTabChange?: (tab: 'customers' | 'employees') => void;
  allUsers?: {
    customers: User[];
    employees: User[];
  };
}

/**
 * A searchable combobox component for selecting users
 * @param props.users - Array of users to display in the dropdown
 * @param props.onSelect - Callback fired when a user is selected
 * @param props.onFilter - Callback fired when users are filtered
 */
export function UserSearchCombobox({
  users,
  onSelect,
  onFilter,
  currentTab,
  onTabChange,
  allUsers,
}: UserSearchComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
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

  // Search in other tab
  const otherTabResults = React.useMemo(() => {
    if (!debouncedSearchQuery || debouncedSearchQuery.length < 3) return [];
    if (!allUsers || !currentTab) return [];

    const otherTabUsers =
      currentTab === 'customers' ? allUsers.employees : allUsers.customers;
    return otherTabUsers.filter(
      user =>
        user.email.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        user.firstname
          ?.toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase()) ||
        user.lastname
          ?.toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase()),
    );
  }, [debouncedSearchQuery, currentTab, allUsers]);

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
          // Handle search on Enter
          if (e.key === 'Enter') {
            console.log('Enter key pressed in Command'); // Debug log
            e.preventDefault();
            e.stopPropagation();
            handleSearch();
          }
        }}
      >
        <CommandInput
          placeholder='Type at least 3 characters and press Enter to search...'
          onValueChange={value => {
            console.log('Search value changed:', value); // Debug log
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
          {debouncedSearchQuery.length >= 3 &&
            otherTabResults.length > 0 &&
            currentTab &&
            onTabChange && (
              <CommandGroup>
                <div className='px-2 py-1.5 text-sm text-muted-foreground flex items-center justify-between'>
                  <span>
                    {otherTabResults.length}{' '}
                    {otherTabResults.length === 1 ? 'match' : 'matches'} found
                    in {currentTab === 'customers' ? 'Employees' : 'Customers'}
                  </span>
                  <Button
                    variant='link'
                    className='h-auto p-0 text-primary'
                    onClick={() => {
                      onTabChange(
                        currentTab === 'customers' ? 'employees' : 'customers',
                      );
                      handleSearch(); // Apply the search in the new tab
                    }}
                  >
                    Switch tab →
                  </Button>
                </div>
              </CommandGroup>
            )}
          {debouncedSearchQuery.length < 3 ? (
            <CommandEmpty>
              Type at least 3 characters and press Enter to search...
            </CommandEmpty>
          ) : dropdownFilteredUsers.length === 0 ? (
            <CommandEmpty>No users found.</CommandEmpty>
          ) : (
            <CommandGroup>
              {dropdownFilteredUsers.map(user => (
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
    [
      dropdownFilteredUsers,
      handleSelect,
      searchQuery,
      value,
      debouncedSearchQuery,
      otherTabResults,
      currentTab,
      onTabChange,
      handleSearch,
      users,
      onFilter,
    ],
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
