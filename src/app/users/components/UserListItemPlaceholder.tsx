/*
 * UserListItemPlaceholder: Loading state component for user list items
 *
 * Dependencies:
 * - Tailwind CSS: Uses animate-pulse for loading animation
 */

/**
 * Placeholder component shown while user list item is loading
 * Uses Tailwind's animate-pulse for loading animation
 */
export function UserListItemPlaceholder() {
  return (
    <article
      className='p-4 grid grid-cols-2 gap-4 animate-pulse'
      aria-label='Loading user information'
    >
      <div className='space-y-2'>
        <div
          className='h-4 bg-gray-200 rounded w-3/4'
          role='presentation'
        ></div>
        <div
          className='h-4 bg-gray-200 rounded w-1/2'
          role='presentation'
        ></div>
        <div
          className='h-4 bg-gray-200 rounded w-1/4'
          role='presentation'
        ></div>
      </div>
      <div className='space-y-2'>
        <div
          className='h-4 bg-gray-200 rounded w-1/2'
          role='presentation'
        ></div>
      </div>
    </article>
  );
}
