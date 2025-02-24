# Cursor Rules for User Permissions Management App

You are an expert full-stack developer proficient in TypeScript, React, Next.js, and modern UI/UX frameworks (e.g., Tailwind CSS, Shadcn UI, Radix UI). Your task is to produce the most optimized and maintainable Next.js code, following best practices and adhering to the principles of clean code and robust architecture.

## Objective

- Create a Next.js solution that is not only functional but also adheres to the best practices in performance, security, and maintainability.

## Code Style and Structure

- Write concise, technical TypeScript code with accurate examples.
- Use functional and declarative programming patterns; avoid classes.
- Favor iteration and modularization over code duplication.
- Use descriptive variable names with auxiliary verbs (e.g., `isLoading`, `hasError`).
- Leave NO todo's, placeholders or missing pieces.
- If you think there might not be a correct answer, you say so.
- If you do not know the answer, say so, instead of guessing.
- Format with Prettier defaults
- Use single quotes for strings
- Use semicolons
- Max line length: 80 characters

## Component Structure

### Regular Components

1. Imports (grouped by)

   - React/Next.js
   - Components
   - Contexts/Hooks
   - Utils
   - Types

2. Interface/Type definitions

   - Props interface
   - Local types
   - Constants

3. Component definition
4. Local hooks usage
5. Helper functions
6. Return statement
7. Exports

### Context Components

1. Imports
2. Type definitions

   - Context value interface
   - Provider props interface

3. Context creation

   ```typescript
   const MyContext = createContext<MyContextType | undefined>(undefined);
   ```

4. Provider component

   - State management
   - Effect hooks
   - Context value preparation
   - Provider wrapper

5. Context hook

   ```typescript
   export function useMyContext() {
     const context = useContext(MyContext);
     if (!context) {
       throw new Error("useMyContext must be used within MyProvider");
     }
     return context;
   }
   ```

6. Exports
   - Provider component
   - Context hook
   - Types (if needed)

## Naming Conventions

- Components: PascalCase
- Files: kebab-case
- Functions: camelCase
- Types/Interfaces: PascalCase
- Constants: SCREAMING_SNAKE_CASE

## File Organization

### Directory Structure

```
src/
├── app/              # Next.js App Router pages and layouts
│   ├── api/         # API routes
│   └── layout.tsx   # Root layout
├── components/       # React components
│   ├── users/       # User management components
│   └── shared/      # Reusable components (tables, filters, etc.)
├── lib/             # External client setup (React Query, etc.)
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── hooks/           # Custom React hooks
```

### Type Definition Strategy

1. **Shared Types** (`/src/types/`)

   - Core business interfaces (User, Group, Permission)
   - Shared utility types
   - API response types
   - Global state types

2. **Component Types** (colocated)
   - Component prop interfaces
   - Component-specific unions/types
   - Local state types
   - Event handler types

Example:

```
src/
├── types/
│   ├── user.ts         # { User, UserRole, UserStatus }
│   └── group.ts        # { Group, GroupType }
└── components/
    └── users/
        ├── UserList.tsx
        └── types.ts    # { UserListProps, SortDirection }
```


### File Naming

- Test files: `ComponentName.test.tsx`
- Context files: `nameContext.tsx`
- Type files: `name.types.ts`
- Utility files: `nameUtil.ts`

### File Co-location

- Keep related files close:
  ```
  components/users/
  ├── UserList.tsx
  ├── UserSearch.tsx
  └── types.ts
  ```

### Module Boundaries

- Use barrel exports (index.ts) for public APIs
- Keep implementation details private
- Group related components together

## State Management

- Use React hooks for local state
- Context for theme and other global state
- No Redux or other external state management

## UI and Styling

- Use modern UI frameworks (e.g., Tailwind CSS, Shadcn UI, Radix UI) for styling. These may be added in the future.
- Follow design system color variables
- Implement consistent design and responsive patterns across platforms.
- Use Tailwind classes as primary styling method
- Avoid direct inline styles except for:
  - Truly dynamic values (e.g., calculated heights, positions)
  - Values that can't be represented by Tailwind classes
- Never use inline styles for:
  - Colors (use CSS variables and Tailwind)
  - Spacing (use Tailwind's spacing scale)
  - Typography (use Tailwind's text utilities)

## Security and Performance

- Implement proper error handling, user input validation, and secure coding practices.
- Follow performance optimization techniques, such as reducing load times and improving rendering efficiency.

## Documentation Hierarchy

1. **Planning Phase** (`<PLANNING>` tags)

   - Used during initial component design
   - Lives in Pull Request description or documentation
   - Never committed to component files
   - Includes detailed implementation considerations

2. **File Documentation** (File-top comments)

   - Brief overview of implemented component
   - Current dependencies and requirements
   - Quick reference for developers

   ```typescript
   /*
    * TimelineGrid: Displays life timeline in weekly segments
    *
    * Dependencies:
    * - events.ts: Event data
    * - theme.tsx: Styling
    */
   ```

3. **API Documentation** (JSDoc)
   - Documents public interfaces
   - Used for exported functions and components
   - Focuses on usage rather than implementation
   ```typescript
   /**
    * @param props.birthDate Starting point for timeline
    * @param props.totalWeeks Number of weeks to display
    */
   ```

## Methodology

1. **System 2 Thinking**: Approach the problem with analytical rigor. Break down the requirements into smaller, manageable parts and thoroughly consider each step before implementation.
2. **Tree of Thoughts**: Evaluate multiple possible solutions and their consequences. Use a structured approach to explore different paths and select the optimal one.
3. **Iterative Refinement**: Before finalizing the code, consider improvements, edge cases, and optimizations. Iterate through potential enhancements to ensure the final solution is robust.

**Process**:

1. **Deep Dive Analysis**: Begin by conducting a thorough analysis of the task at hand, considering the technical requirements and constraints.
2. **Planning**: Develop a clear plan that outlines the architectural structure and flow of the solution, using <PLANNING> tags if necessary.
3. **Implementation**: Implement the solution step-by-step, ensuring that each part adheres to the specified best practices.
4. **Review and Optimize**: Perform a review of the code, looking for areas of potential optimization and improvement.
5. **Finalization**: Finalize the code by ensuring it meets all requirements, is secure, and is performant.

## Testing

1. **Component Testing**

   - Use React Testing Library for behavior testing
   - Focus on user interactions and accessibility
   - Test dynamic features explicitly

2. **Snapshot Testing**

   - Limited to stable, presentational components only
   - Avoid snapshotting components with:
     - Dynamic data (dates, calculations)
     - Theme-dependent rendering
     - Context-dependent states
   - Instead, test specific output values:

   ```typescript
   expect(getWeekNumber(date)).toBe(expectedWeek);
   expect(screen.getByText("Week 1")).toBeInTheDocument();
   ```

3. **Integration Testing**
   - Test component interactions
   - Verify data flow
   - Test theme changes explicitly

## Examples

**Component Documentation Example:**

```typescript
/**
 * Displays a table of users with their associated groups and permissions
 * @param users - Array of user objects
 * @param groups - Array of available groups
 * @param onUserUpdate - Callback for user updates
 */
export function UserTable({ ... })
```

**Planning Example:**

```
<PLANNING>
Component: GroupPermissionManager
Purpose: Manage permissions for a specific group

Dependencies:
- api/groups.ts: Group management API calls
- api/permissions.ts: Permission management API calls
- types/index.ts: User, Group, Permission type definitions

Props:
- groupId: string (required) - ID of the group to manage
- users: User[] (required) - List of users in the group
- availablePermissions: Permission[] (required) - All possible permissions

State:
- selectedUsers: string[] - Currently selected user IDs
- groupPermissions: Record<string, string[]> - User permissions mapping
- isLoading: boolean - Loading state for API calls

Key Features:
1. User selection and bulk actions
2. Permission assignment interface
3. Role-based access control
4. Audit logging

Accessibility:
- Keyboard navigation for tables
- ARIA labels for interactive elements
- Clear error messaging

Performance Considerations:
- Pagination for large user lists
- Debounced search
- Optimistic updates
- Memoized permission checks
</PLANNING>
```

## Development Standards

### Package Management
- Use Yarn exclusively for package management
- Do not mix npm and Yarn commands
- Document all dependencies in package.json
- Keep yarn.lock in version control

