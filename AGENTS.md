# AGENTS.md

## Purpose

This file gives coding agents the local conventions for this repository.
Prefer small, targeted edits that match the current structure instead of broad refactors.

## Repo Snapshot

- App type: Vite + React 18 + TypeScript SPA.
- Package manager: Yarn Classic (`yarn.lock` is present).
- UI stack: Tailwind CSS + shadcn/ui + Radix UI.
- Data layer: React Query for async state, axios and Supabase clients for transport.
- Forms: `react-hook-form` + `zod`.
- Routing: `react-router-dom` with route constants in `src/router/paths.ts`.
- Path alias: `@/*` maps to `src/*`.

## Install And Run

```bash
yarn
yarn start
```

- Local dev server: `yarn start`.
- Default Vite port is whatever Vite selects; do not hardcode a different port unless config changes.

## Build, Lint, And Test Commands

```bash
yarn start
yarn build
yarn lint
yarn preview
```

- `yarn start` - run the Vite dev server.
- `yarn build` - run `tsc && vite build`.
- `yarn lint` - run ESLint on all `ts` and `tsx` files with `--max-warnings 0`.
- `yarn preview` - preview the production build.

## Verified Current Status

- `yarn build` succeeds today.
- Build output reports a CSS minification warning and a large chunk warning.
- `yarn lint` fails today because warnings are treated as errors.
- Existing lint warnings include explicit `any`, React Fast Refresh export warnings in some shadcn files, and one hook dependency warning.

## Focused Commands

Use local binaries through Yarn when you only need a narrow check.

```bash
yarn eslint src/features/auth/components/login-form.tsx
yarn eslint src/features/employees/hooks/useUser.ts
yarn tsc --noEmit
```

- Single-file lint: `yarn eslint path/to/file.tsx`.
- Whole-project type check: `yarn tsc --noEmit`.
- There is no dedicated script for partial builds.

## Test Status

There is no test runner configured in `package.json` right now.

- No `test` script exists.
- No `vitest`, `jest`, `playwright`, or `cypress` config is present.
- No `*.test.*` or `*.spec.*` files exist under `src`.
- There is currently no supported single-test command because there are no tests.

If you add tests, also add package scripts and update this file.
Preferred future direction would be Vitest because the app already uses Vite.

## High-Level Structure

- `src/components/ui` - reusable UI primitives, mostly shadcn-style wrappers.
- `src/features` - feature-owned pages, hooks, forms, models, and helpers.
- `src/api` - repository selection and data access adapters.
- `src/core` - shared services, environment helpers, i18n, storage, and low-level utilities.
- `src/router` - router setup and route constants.
- `src/lib` - small shared helpers such as `cn()` and timezone utilities.

## Architecture Conventions

- Keep feature logic inside its feature folder when possible.
- Reuse shared UI from `src/components/ui` before creating new primitives.
- Add cross-cutting utilities to `src/core` or `src/lib`, not to random feature folders.
- Use the repository pattern already present in `src/api/repositories` when adding new backend resources.
- Keep route strings centralized in `src/router/paths.ts`.
- Use React Query for remote async data instead of ad hoc fetch state in components.

## Imports

- Prefer this import order: React/framework, third-party packages, app aliases from `@/`, then relative imports.
- Prefer `@/` aliases for cross-feature imports.
- Use relative imports for nearby files in the same feature subtree.
- Avoid `src/...` absolute imports; one legacy example exists, but `@/...` is the preferred pattern.
- Use `import type` for type-only imports when practical.
- Keep imports grouped and remove unused imports immediately.

## Formatting

- Follow the surrounding file style instead of mass-reformatting.
- Semicolons are the dominant style; keep using them.
- Quote style is mixed across the repo; preserve the file-local style when editing.
- For new `src` files, prefer the dominant application style: double quotes and semicolons.
- Keep JSX readable; split props across lines when a tag becomes dense.
- Do not introduce a formatter-specific rewrite unless the repo adds a formatter config.

## TypeScript And Types

- `tsconfig.json` uses `strict: true`.
- `noImplicitAny` is disabled, but ESLint warns on explicit `any`; avoid `any` anyway.
- Prefer explicit domain types in repositories, hooks, and exported helpers.
- Use `z.infer<typeof schema>` for form types derived from Zod schemas.
- Use `type` for unions, mapped types, and utility compositions.
- Use `interface` for component props or extensible object contracts when that reads better.
- Keep backend-to-frontend mapping logic explicit, like `mapFormValuesToUser()`.
- Avoid non-null assertions unless the value is guaranteed by framework setup or env requirements.

## Naming

- Components: PascalCase (`MainLayout`, `LoginForm`).
- Hooks: `useX` (`useUsers`, `useAuth`).
- Utility functions and variables: camelCase.
- Shared constants: UPPER_SNAKE_CASE or all-caps objects when already established (`PATHS`, `LSKeys`, `ROLES`).
- File names are mostly kebab-case in features and UI folders; follow local patterns.
- Some legacy model files use PascalCase names like `src/models/User.ts`; do not rename existing files unless needed.

## React Conventions

- Prefer function components and hooks.
- Use `React.forwardRef` only for reusable low-level UI primitives.
- Keep page-level composition in feature pages, not in `App.tsx`.
- Keep providers near the root; `App.tsx` already wires React Query, auth, routing, and toasts.
- Prefer declarative React Query hooks over manual `useEffect` + `useState` data fetching.

## Forms And Validation

- Use `react-hook-form` for non-trivial forms.
- Put schemas next to the form flow, as done in `src/features/employees/forms/new-employee/schema.ts`.
- Reuse shared validators from `src/core/utils/forms/fileValidation.ts`.
- Keep validation messages consistent with the screen language; much of the employee flow is in Spanish.
- Derive form value types from schemas instead of duplicating interfaces.

## Error Handling

- Let repository methods throw transport errors unless there is a clear recovery path.
- Surface user-facing async errors through the existing React Query mutation cache toast pattern in `src/App.tsx`.
- Only catch errors when you can recover, reset state, redirect, or add useful context.
- Do not silently swallow errors.
- Keep `console.error` limited to boundary points such as provider initialization or global mutation handling.

## Data And API Conventions

- `src/api/index.ts` chooses the active `userRepository` via `VITE_API_PROVIDER`.
- Supabase config relies on `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- REST clients use axios instances built from `src/core/environment/index.ts`.
- When adding a new resource, keep the repository interface and each backend implementation aligned.
- Invalidate relevant React Query keys after successful mutations.

## Styling And UI

- Prefer existing shadcn/ui primitives before inventing new base components.
- Use `cn()` from `src/lib/utils.ts` to merge Tailwind classes.
- Reuse Tailwind theme tokens and CSS variables from `src/globals.css` and `tailwind.config.js`.
- Keep layout work inside existing containers and layout primitives where possible.
- Avoid introducing a separate styling system.

## Routing, Auth, And State

- Add or change route paths in `src/router/paths.ts` first, then wire them in `src/router/index.tsx`.
- Keep auth state inside `AuthContext` and related hooks.
- Store browser persistence through `LocalStorage` helpers instead of raw `window.localStorage` calls.
- Use feature hooks as the main component-facing API for async data.

## Cursor And Copilot Rules

- Cursor rules directory exists at `.cursor/rules/`.
- The only file found is `.cursor/rules/final-project-work-app.mdc`.
- That file currently contains empty frontmatter and no actionable instructions.
- No `.cursorrules` file was found.
- No `.github/copilot-instructions.md` file was found.

## Practical Guidance For Agents

- Prefer small edits over broad cleanup.
- Preserve existing behavior unless the task explicitly asks for refactoring.
- If you touch lint-problematic files, avoid making the warning situation worse.
- Update this file if you add tests, new scripts, or new repo-wide rules.
- Do not commit changes unless explicitly asked
