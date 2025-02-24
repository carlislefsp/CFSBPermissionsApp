'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className='border-b'>
      <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
        <Link href='/' className='text-xl font-bold'>
          User Permissions
        </Link>
        <nav className='space-x-4'>
          <Link href='/users' className='hover:text-gray-600'>
            Users
          </Link>
          <Link href='/groups' className='hover:text-gray-600'>
            Groups
          </Link>
        </nav>
      </div>
    </header>
  );
}
