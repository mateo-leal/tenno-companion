# Contributing to Tenno Companion

Thank you for helping improve the project. This guide covers everything you need to get set up, where to find the relevant code, and how pull requests are reviewed.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting started](#getting-started)
- [Monorepo structure](#monorepo-structure)
- [Project layout](#project-layout)
- [Development workflow](#development-workflow)
- [Pull request guidelines](#pull-request-guidelines)
- [Adding or updating features](#adding-or-updating-features)
  - [Adding a KIM chatroom](#adding-a-kim-chatroom)
  - [Adding a checklist task](#adding-a-checklist-task)
  - [Adding a translation string](#adding-a-translation-string)
- [Code style](#code-style)
- [Testing](#testing)
- [Translations](#translations)

---

## Code of Conduct

Be respectful, constructive, and welcoming to everyone regardless of experience level.

---

## Getting started

```bash
# Install dependencies across all workspaces
pnpm install

# Start the dev server (runs all workspace dev scripts)
pnpm dev

# Build all workspaces
pnpm build

# Run tests across all workspaces
pnpm test
```

Open http://localhost:3000.

**Prerequisites:** Node.js 22.17.0+, pnpm 10+.

---

## Monorepo structure

This is a TypeScript monorepo managed with pnpm workspaces and Turbo for build orchestration.

```
apps/
  web/                 Next.js web application (tenno-companion)
    app/               Page routes and API handlers
    components/        React components
    lib/               Utilities and data management
    messages/          Localization files
packages/
  core/                Shared library (@tenno-companion/core)
    src/               TypeScript source code
    data/              Static game data and metadata
    scripts/           Build and data processing scripts
```

### Workspace-specific commands

```bash
# Work only in apps/web
pnpm --filter tenno-companion dev
pnpm --filter tenno-companion build
pnpm --filter tenno-companion test

# Work only in packages/core
pnpm --filter @tenno-companion/core build
pnpm --filter @tenno-companion/core test
pnpm --filter @tenno-companion/core publish --access public
```

---

## Project layout

### `apps/web` — Main web application

```
app/[locale]/          Next.js page routes (checklist, kim, mastery)
  checklist/           Checklist feature pages
  kim/                 KIM Pathfinder pages
  mastery/             Mastery rank pages
app/api/               API route handlers
  dialogues/           Dialogue data endpoints
  simulate/            KIM simulation endpoints
components/            React UI components
  kim/                 KIM selector and transcript components
  checklist/           Checklist panel and task rows
  mastery/             Mastery panel components
  widgets/             Home widgets (world cycles, news)
  windows/             Windowed layout components
  ui/                  Base UI components (button, input, tabs)
  providers/           Context providers (game data, etc.)
lib/
  kim/                 Graph loader, explorer, ranker, formatter, boolean utils
  checklist/           Task definitions, reset logic, state management
  mastery/             Mastery data assembly from @tenno-companion/core
  world-state/         World state data fetching
  utils/               Common utility functions
  types.ts             Shared TypeScript types
messages/              Locale JSON dictionaries (en.json is canonical)
i18n/                  Localization configuration and routing
```

### `packages/core` — Shared library

```
src/
  lib/
    constants.ts       Warframe game constants (mission types, weapons, etc.)
    types.ts           TypeScript type definitions
    locales.ts         Locale definitions
  index.ts             Public API exports
data/
  commit-sha           Git commit reference
  dicts/               Static game data files
  stats/               Game statistics
```

---

## Development workflow

1. Create a branch from `main` with a descriptive name:

   ```bash
   git checkout -b feat/my-feature
   # or
   git checkout -b fix/my-bug
   ```

2. Make focused, well-scoped commits.

3. Before opening a PR, run tests and lint from the repository root:

   ```bash
   pnpm lint      # Lints all workspaces
   pnpm test      # Tests all workspaces
   pnpm build     # Builds all workspaces
   ```

   Or test specific workspaces:

   ```bash
   pnpm --filter tenno-companion lint
   pnpm --filter @tenno-companion/core test
   ```

4. Open a pull request against `main` with:
   - A clear description of **what** changed and **why**.
   - Screenshots or GIFs for any visible UI changes.
   - If updating `packages/core`, indicate this may affect the published npm package.

---

## Pull request guidelines

- Keep PRs small and reviewable. One concern per PR is ideal.
- Prefer editing existing files over adding new ones unless a new module is genuinely needed.
- Don't add docstrings, comments, or type annotations to code you didn't touch.
- Don't refactor or reformat code outside the scope of your change.
- All CI checks (lint, tests, build) must pass before merging.

---

## Adding or updating features

### Adding a KIM chatroom

1. Open `apps/web/lib/kim/chatrooms.ts`.
2. Add a new entry to `CHATROOM_SOURCE_BY_ID` with the chatroom id as the key and the `kim.browse.wf` JSON URL as the value.
3. Add a speaker entry to `SPEAKERS` if the character is new.
4. Add a display entry to the appropriate group array (`HEX_CHATROOMS` or `CATHEDRALE_CHATROOMS`).

The new chatroom will be automatically included in static generation and the selector UI.

### Adding a checklist task

1. Open `apps/web/lib/checklist/tasks.ts`.
2. Add a `ChecklistTask` entry to `DAILY_TASKS`, `WEEKLY_TASKS`, or `OTHER_TASKS`.
3. Add translated labels for all applicable keys to every file in `apps/web/messages/`. The `en.json` keys live under `checklist.daily.tasks`, `checklist.weekly.tasks`, or `checklist.other.tasks`.

For tasks with subitems, set list children under `subitems`.

Reset behavior is controlled by the `resets` field:

- `'daily'` — clears at UTC midnight.
- `'weekly'` — clears at the start of the UTC week.
- `'sortie'` — clears at 16:00 UTC daily.
- `'eightHours'` — clears on 8-hour intervals anchored at 08:00 UTC.
- `'hourly'` — clears every hour.
- `'baro'` — clears on Baro Ki'Teer arrival/departure.
- Omitted — manual only, never auto-clears.

### Adding a translation string

1. Add the key and English value to `apps/web/messages/en.json` in the appropriate namespace.
2. The key will show up on [Crowdin](https://crowdin.com/project/tenno-companion) for community translation.
3. If you can provide translations yourself, add them to the relevant `apps/web/messages/<locale>.json` files too.

---

## Code style

- TypeScript strict mode is enforced — avoid `any` casts.
- Use `clsx` / `cn` (from `apps/web/lib/utils`) for conditional class names.
- Reuse existing helpers in `apps/web/lib/kim/` before writing new graph utilities.
- Server components and client components are separated; don't add `'use client'` unless the component genuinely needs browser APIs or React state/effects.
- Use the `next-intl` helpers (`useTranslations`, `getTranslations`) for all user-facing strings. Hard-coded English strings in components are not acceptable for new code.

---

## Testing

Tests live alongside their modules in `__tests__/` subdirectories and use Jest + Testing Library.

```bash
# Run tests in all workspaces
pnpm test

# Run tests in a specific workspace
pnpm --filter tenno-companion test
pnpm --filter @tenno-companion/core test

# Watch mode (only available in web app currently)
pnpm --filter tenno-companion test:watch
```

- Add tests for new pure utility functions in `lib/`.
- UI component tests are welcome but not required for every change.
- All existing tests must continue to pass.

---

## Translations

The UI is translated via [Crowdin](https://crowdin.com/project/tenno-companion). If you want to improve a translation or add support for a language that is not yet covered:

1. Visit the Crowdin project page and join.
2. The source language is English (`messages/en.json`).
3. Translated strings are synced to `messages/<locale>.json` files.

If you notice a translation issue in a PR, note it in the review — no need to block the PR for it.
