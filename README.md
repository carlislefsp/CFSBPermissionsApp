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
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd CFSBPermissionsApp
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL="your-api-url-here"
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/           # Next.js App Router pages and layouts
├── components/    # React components
├── lib/          # External client setup
├── types/        # TypeScript type definitions
├── utils/        # Utility functions
└── hooks/        # Custom React hooks
```

## Development Commands

| Script      | npm              | yarn           | Description                   |
|-------------|-----------------|----------------|-------------------------------|
| Development | `npm run dev`   | `yarn dev`     | Start development server     |
| Build       | `npm run build` | `yarn build`   | Build production bundle      |
| Start       | `npm run start` | `yarn start`   | Start production server      |
| Lint        | `npm run lint`  | `yarn lint`    | Run ESLint                   |
| Type Check  | `npm typecheck` | `yarn typecheck`| Run TypeScript compiler     |

## Built With

- [Next.js 14](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [React Query](https://tanstack.com/query) - State management
- [Shadcn UI](https://ui.shadcn.com/) - UI components
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [Zod](https://zod.dev/) - Data validation

## Contributing

1. Review [RULES.md](./RULES.md) and [PLANNING.md](./PLANNING.md)
2. Create a feature branch
3. Make your changes
4. Submit a pull request
