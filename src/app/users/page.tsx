'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserList } from './components/UserList';
import { isEmployeeEmail } from '@/config/domains';

export default function UsersPage() {
  return (
    <div className='container py-6'>
      <Tabs defaultValue='customers' className='space-y-6'>
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
          <UserList filterFn={user => !isEmployeeEmail(user.email)} />
        </TabsContent>
        <TabsContent value='employees' className='space-y-4'>
          <div>
            <h1 className='text-2xl font-bold'>Employees</h1>
            <p className='text-muted-foreground'>
              Internal CFS Brands staff accounts
            </p>
          </div>
          <UserList filterFn={user => isEmployeeEmail(user.email)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
