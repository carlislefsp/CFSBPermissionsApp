import Link from 'next/link';

export default function Home() {
  return (
    <div className='max-w-3xl mx-auto text-center'>
      <h1 className='text-4xl font-bold mb-6'>User Permissions Management</h1>
      <p className='text-lg text-gray-600 mb-8'>
        Manage users, groups, and permissions in one place.
      </p>
      <div className='bg-uil1 grid grid-cols-2 gap-4 max-w-xl mx-auto'>
        <Link
          href='/users'
          className='p-6 border bg-uil2 rounded-lg hover:border-gray-400 transition-colors'
        >
          <h2 className='text-xl font-semibold mb-2'>Users</h2>
          <p className='text-gray-600'>Manage user access and permissions</p>
        </Link>
        <Link
          href='/groups'
          className='p-6 border bg-uil2 rounded-lg hover:border-gray-400 transition-colors'
        >
          <h2 className='text-xl font-semibold mb-2'>Groups</h2>
          <p className='text-gray-600'>Configure group permissions</p>
        </Link>
      </div>
    </div>
  );
}
