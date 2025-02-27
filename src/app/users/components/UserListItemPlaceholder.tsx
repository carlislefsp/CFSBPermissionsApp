/*
 * UserListItemPlaceholder: Loading state component for user list items
 *
 * Dependencies:
 * - Tailwind CSS: Uses animate-pulse for loading animation
 */

/**
 * Placeholder component that provides a loading state for user list items
 *
 * Features:
 * - Smooth pulse animation for loading indication
 * - Maintains visual hierarchy of actual content
 * - Responsive layout matching UserListItem
 * - Proper ARIA attributes for accessibility
 * - Zero-prop simple implementation
 *
 * Animation:
 * - Uses Tailwind's animate-pulse for consistent loading states
 * - Maintains layout stability during loading
 * - Prevents content shift when real content loads
 *
 * Accessibility:
 * - Properly labeled loading state
 * - Announced to screen readers
 * - Maintains layout landmarks
 *
 * @example
 * ```tsx
 * // Used directly in loading states
 * <UserListItemPlaceholder />
 *
 * // Used conditionally
 * {isLoading ? <UserListItemPlaceholder /> : <UserListItem user={user} />}
 * ```
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
