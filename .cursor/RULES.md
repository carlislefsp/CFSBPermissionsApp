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

- Components and Component Files: PascalCase
  ```typescript
  // Component name and its file:
  UserList.tsx        // Contains: export function UserList()
  UserListItem.tsx    // Contains: export function UserListItem()
  Button.tsx         // Contains: export function Button()
  ```

- Non-Component Files: kebab-case
  ```typescript
  // Utilities, configs, etc:
  date-helpers.ts
  api-utils.ts
  form-validation.ts
  ```

- Functions: camelCase
  ```typescript
  function handleSubmit()
  function formatDate()
  ```

- Types/Interfaces: PascalCase
  ```typescript
  interface UserProps
  type ButtonVariant
  ```

- Constants: SCREAMING_SNAKE_CASE
  ```typescript
  const MAX_ITEMS = 10
  const API_BASE_URL = '/api'
  ```

## File Organization

### Directory Structure

```
src/
├── app/              # Next.js app directory
│   ├── users/        # User section
│   │   ├── components/  # User-specific components
│   │   ├── hooks/      # User-specific hooks
│   │   └── types/      # User-specific types
│   └── groups/      # Group section
│       ├── components/ # Group-specific components
│       └── hooks/     # Group-specific hooks
├── components/      # Shared components only
├── hooks/          # Shared hooks
├── types/          # Shared types
├── lib/           # Library setups and core utilities
│   ├── react-query.ts  # React Query setup
│   └── utils.ts       # General utilities
├── services/      # API and data services
│   ├── api.ts    # Base API configuration
│   └── [feature].ts  # Feature-specific API services
└── config/       # Application configuration
    └── domains.ts  # Domain and environment configs
```

### Service Layer

- Keep API-related logic in `services/` directory
- Each feature should have its own service file
- Use TypeScript for full type safety in API calls
- Implement proper error handling and response typing
- Follow RESTful principles for API endpoint organization
- Centralize API configuration and interceptors in `api.ts`

### Configuration Management

- Store configuration in `config/` directory
- Use environment variables for sensitive data
- Keep domain-specific configuration separate
- Export constants and configuration objects
- Use TypeScript enums or as const assertions for configuration values
- Document all configuration options and their purposes

### Library Setup

- Keep library initialization in `lib/` directory
- Configure third-party libraries (e.g., React Query)
- Store reusable utility functions
- Keep setup logic separate from business logic
- Document any library-specific configuration
- Implement type-safe utility functions

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
2. **Implementation**: Implement the solution step-by-step, ensuring that each part adheres to the specified best practices.
3. **Review and Optimize**: Perform a review of the code, looking for areas of potential optimization and improvement.
4. **Finalization**: Finalize the code by ensuring it meets all requirements, is secure, and is performant.

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


## Development Standards

### Package Management
- Use Yarn exclusively for package management
- Do not mix npm and Yarn commands
- Document all dependencies in package.json
- Keep yarn.lock in version control

## Communication Style

1. Start every response with 🤖 to identify as the AI assistant
2. Be conversational but professional
3. Format code blocks with appropriate language tags

## Pull Request Documentation

### PR Summary File
Maintain PR summaries in PR_SUMMARY.md using this structure:
```markdown
# Active Pull Request Summaries

## [Branch/Feature Name]
Last Updated: [Date]

### PR Summary
- Key Changes:
- Technical Decisions:
- Performance Considerations:
- Testing Notes:

### Implementation Details
```

### Process
1. Start tracking changes by saying "Let's track changes for a PR description for [branch/feature name]"

2. Commands supported:
   - "Show PR summary for [branch/feature]" - Display current summary
   - "Add to PR summary for [branch/feature]" - Add new items
   - "Update PR summary for [branch/feature]" - Modify existing items
   - "Generate PR description for [branch/feature]" - Create final PR description
   - "Remove PR summary for [branch/feature]" - Delete completed PR summary

3. The PR_SUMMARY.md file will persist between sessions to maintain a history of changes.