import { UserList } from './components/UserList';

export default function UsersPage() {
  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Users</h1>
      <UserList />
    </div>
  );
}
