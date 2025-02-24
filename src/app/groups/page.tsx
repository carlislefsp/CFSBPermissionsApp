import { GroupList } from '@/components/groups/GroupList';

export default function GroupsPage() {
  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Groups</h1>
      <GroupList />
    </div>
  );
}
