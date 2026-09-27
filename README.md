# Spanish Flashcards

A responsive web application for learning Spanish vocabulary through interactive
flashcards, quizzes, and progress tracking. See [`docs/specification.md`](docs/specification.md)
for the full product specification and [`docs/TODO.md`](docs/TODO.md) for the
phased implementation checklist.

## Tech stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/) for client-side routing
- [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react) for unit/component testing
- [Playwright](https://playwright.dev/) for end-to-end testing
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) for linting/formatting
- IndexedDB (via a repository abstraction) for local persistence (added in a later phase)

## Getting started

```bash
npm install
npm run dev
```

The app is served at the URL printed in the terminal (typically `http://localhost:5173`).

## Available scripts

| Script                 | Description                                                                       |
| ---------------------- | --------------------------------------------------------------------------------- |
| `npm run dev`          | Start the Vite dev server with HMR                                                |
| `npm run build`        | Type-check and build for production                                               |
| `npm run preview`      | Preview the production build locally                                              |
| `npm run typecheck`    | Run the TypeScript compiler with no emit                                          |
| `npm run lint`         | Lint the codebase with ESLint                                                     |
| `npm run lint:fix`     | Lint and auto-fix where possible                                                  |
| `npm run format`       | Format the codebase with Prettier                                                 |
| `npm run format:check` | Check formatting without writing changes                                          |
| `npm test`             | Run the unit/component test suite once with Vitest                                |
| `npm run test:watch`   | Run the unit/component test suite in watch mode                                   |
| `npm run test:ui`      | Run the unit/component test suite with the Vitest UI                              |
| `npm run test:e2e`     | Run the Playwright end-to-end test suite (starts its own dev server on port 5183) |
| `npm run test:e2e:ui`  | Run the Playwright suite with its interactive UI mode                             |

## Project structure

```text
src/
├── components/     # Reusable UI components (e.g. Navigation)
├── pages/           # Route-level page components
├── domain/          # Framework-independent domain types and business rules
├── services/        # Application/business logic (Study, Quiz, Import, Statistics)
├── repositories/     # Data-access contracts consumed by services
├── storage/          # IndexedDB setup (the only layer allowed to touch it)
├── types/             # Shared cross-cutting TypeScript types
├── utils/             # Small framework-independent helper functions
├── data/               # Seed data shipped with the app
├── test/                # Test setup/utilities
├── App.tsx
├── routes.tsx
└── main.tsx
```

The UI layer never talks to IndexedDB directly — it goes through services and
repositories — so the storage backend can later be swapped for a remote API
without rewriting the UI or business logic.

End-to-end tests live outside `src/`, in `e2e/` at the project root, and drive
the app through a real browser via Playwright (see `playwright.config.ts`).
