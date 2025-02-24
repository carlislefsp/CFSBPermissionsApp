# CFSBPermissionsApp

A Next.js application for managing user permissions and group assignments.

## Development

For detailed architecture, design decisions, and development roadmap, see our [Planning Document](PLANNING.md).

## Features

- 👥 Comprehensive user management
- 🔑 Permission controls and group assignments
- 🔍 Advanced search and filtering
- 💾 Client-side caching for performance
- 📊 Bulk operations support

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd CFSBPermissionsApp
```

2. Install dependencies:

```bash
yarn install
```

3. Initialize Shadcn UI:

```bash
npx shadcn-ui@latest init
```

When prompted, select these options:
- Style: Default
- Base color: Slate
- CSS variables: Yes
- Tailwind CSS config: Yes
- Components directory: src/components
- Utilities directory: src/lib/utils
- Include example components: No

4. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL="your-api-url-here"
```

5. Start the development server:

```bash
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/           # Next.js App Router pages and layouts
├── components/    # React components
│   ├── ui/       # Shadcn UI components
│   └── shared/   # Reusable components
├── lib/          # External client setup
├── types/        # TypeScript type definitions
├── utils/        # Utility functions
└── hooks/        # Custom React hooks
```

## Development Commands

| Script      | Command         | Description                   |
|-------------|----------------|-------------------------------|
| Development | `yarn dev`     | Start development server     |
| Build       | `yarn build`   | Build production bundle      |
| Start       | `yarn start`   | Start production server      |
| Lint        | `yarn lint`    | Run ESLint                   |
| Type Check  | `yarn typecheck`| Run TypeScript compiler     |

## Adding Shadcn UI Components

To add individual components from Shadcn UI:

```bash
npx shadcn-ui@latest add [component-name]
# Example: npx shadcn-ui@latest add button
```

Common components we'll use:
- button
- table
- dialog
- dropdown-menu
- input
- select
- checkbox
- toast

## Built With

- [Next.js 14](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Shadcn UI](https://ui.shadcn.com/) - UI components
- [React Query](https://tanstack.com/query) - State management
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [Zod](https://zod.dev/) - Data validation

## Contributing

1. Review [RULES.md](./RULES.md) and [PLANNING.md](./PLANNING.md)
2. Create a feature branch
3. Make your changes
4. Submit a pull request
