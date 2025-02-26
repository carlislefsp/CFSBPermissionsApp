'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserList } from './components/UserList';
import { isEmployeeEmail } from '@/config/domains';
import { useState } from 'react';
import { useUsers } from './hooks/useUsers';
import { User } from '@/types/user';

interface SearchTerm {
  id: string;
  term: string;
}

export default function UsersPage() {
  const [currentTab, setCurrentTab] = useState<'customers' | 'employees'>(
    'customers',
  );
  const { data: users = [] } = useUsers();
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [searchFilteredUsers, setSearchFilteredUsers] = useState<User[]>([]);
  const [searchTerms, setSearchTerms] = useState<SearchTerm[]>([]);

  // Pre-filter users for each tab
  const allUsers = {
    customers: users.filter(user => !isEmployeeEmail(user.email)),
    employees: users.filter(user => isEmployeeEmail(user.email)),
  };

  const handleSearchFilter = (filtered: User[], searchTerm?: string) => {
    if (!searchTerm) {
      setSearchTerms([]);
      setSearchFilteredUsers([]);
      return;
    }

    // Add new search term
    const newTerm: SearchTerm = {
      id: Math.random().toString(36).substring(7),
      term: searchTerm,
    };

    setSearchTerms(prev => [...prev, newTerm]);

    // Update filtered users based on all search terms
    const updatedTerms = [...searchTerms, newTerm];
    const newFilteredUsers = users.filter(user =>
      updatedTerms.every(({ term }) =>
        [user.email, user.firstname, user.lastname].some(field =>
          field?.toLowerCase().includes(term.toLowerCase()),
        ),
      ),
    );

    setSearchFilteredUsers(newFilteredUsers);
  };

  const removeSearchTerm = (termId: string) => {
    const updatedTerms = searchTerms.filter(term => term.id !== termId);
    setSearchTerms(updatedTerms);

    if (updatedTerms.length === 0) {
      setSearchFilteredUsers([]);
      return;
    }

    // Reapply remaining filters
    const newFilteredUsers = users.filter(user =>
      updatedTerms.every(({ term }) =>
        [user.email, user.firstname, user.lastname].some(field =>
          field?.toLowerCase().includes(term.toLowerCase()),
        ),
      ),
    );

    setSearchFilteredUsers(newFilteredUsers);
  };

  return (
    <div className='container py-6'>
      <Tabs
        defaultValue='customers'
        className='space-y-6'
        value={currentTab}
        onValueChange={value =>
          setCurrentTab(value as 'customers' | 'employees')
        }
      >
        <TabsList className='grid w-[400px] grid-cols-2'>
          <TabsTrigger value='customers'>Customers</TabsTrigger>
          <TabsTrigger value='employees'>Employees</TabsTrigger>
        </TabsList>
        <TabsContent value='customers' className='space-y-4'>
          <div>
            <h1 className='text-2xl font-bold'>Customers</h1>
            <p className='text-muted-foreground'>
              External users and customer accounts
            </p>
          </div>
          <UserList
            filterFn={user => !isEmployeeEmail(user.email)}
            currentTab={currentTab}
            onTabChange={setCurrentTab}
            allUsers={allUsers}
            selectedUser={selectedUser}
            onSelectUser={setSelectedUser}
            searchFilteredUsers={searchFilteredUsers}
            searchTerms={searchTerms}
            onSearch={handleSearchFilter}
            onRemoveSearchTerm={removeSearchTerm}
          />
        </TabsContent>
        <TabsContent value='employees' className='space-y-4'>
          <div>
            <h1 className='text-2xl font-bold'>Employees</h1>
            <p className='text-muted-foreground'>
              Internal CFS Brands staff accounts
            </p>
          </div>
          <UserList
            filterFn={user => isEmployeeEmail(user.email)}
            currentTab={currentTab}
            onTabChange={setCurrentTab}
            allUsers={allUsers}
            selectedUser={selectedUser}
            onSelectUser={setSelectedUser}
            searchFilteredUsers={searchFilteredUsers}
            searchTerms={searchTerms}
            onSearch={handleSearchFilter}
            onRemoveSearchTerm={removeSearchTerm}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
