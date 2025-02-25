# Application Architecture

## Overview

A Next.js application for managing CFS Brands user groups and permissions, built with TypeScript and modern React patterns.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query + React Context


## Directory Structure 
```
src/
├── app/              # Next.js App Router pages and layouts
│ ├── api/            # API route handlers
│ ├── users/          # Users management pages and components
│ ├── groups/         # Groups management pages and components
│ ├── global.css      # Global CSS styles
│ ├── page.tsx        # Root page
│ └── layout.tsx      # Root layout
├── components/       # React components
│ └── shared/         # Reusable components
├── services/         # API service layer
├── types/            # TypeScript type definitions
├── lib/              # Utility functions
└── hooks/            # Custom React hooks
```

## Key Design Decisions

### 1. API Layer
- Service-based architecture for API calls
- Centralized error handling
- Type-safe API responses

### 2. Component Architecture
- Client/Server component separation
- Lazy loading for performance
- Component-specific types co-located with components

### 3. State Management
- React Query for server state
- React Context for global UI state
- Local state for component-specific needs

### 4. Authentication & Authorization
- Azure AD B2C integration
- Role-based access control
- Secure session management

### 5. Performance Considerations
- Route-based code splitting
- Image optimization
- Lazy loading of components
- Efficient data fetching patterns

## Data Flow

1. User interactions trigger client-side events
2. Events handled by React components
3. API calls made through service layer
4. Server responds with typed data
5. UI updates through React Query cache

## Security Measures

- HTTPS-only communication
- Secure cookie handling
- Input sanitization
- CORS configuration
- Environment variable protection

## Future Considerations

- Potential migration to server components
- Enhanced caching strategies
- Performance monitoring implementation
- Accessibility improvements

## Development Guidelines

1. Follow component structure defined in RULES.md
2. Maintain type safety throughout the application
3. Write tests for critical functionality
4. Document significant architectural decisions
