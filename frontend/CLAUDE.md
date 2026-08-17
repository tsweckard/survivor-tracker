# Frontend Development Guidelines

React/TypeScript conventions for the Survivor Tracker frontend.
This file is referenced from the root `CLAUDE.md`.

---

## Directory Structure

```
frontend/src/
  components/          # React components — one component per file
    ui/                # Reusable, domain-agnostic UI primitives (StatCell, etc.)
    icons/             # SVG icon components
    SeasonSetup/       # Feature group: multi-step wizard components
  utils/               # Pure functions — formatting, calculations
  services/            # API client layer
  store/               # Zustand stores
  types/               # Shared TypeScript interfaces
```

---

## Component Rules

- **One component per file.** Never define multiple non-trivial components in the same file.
- **Default export** for the primary component in each file.
- **Named exports** for utilities, constants, and types in non-component files.
- File name matches component name exactly: `SeasonCard.tsx` → `export default function SeasonCard`.
- Props interfaces are defined in the same file as the component — not in `types/`.

---

## Types

- Interfaces used across multiple components or services belong in `src/types/index.ts`.
- Component-local prop types stay in the component file.
- No `any`. Use `unknown` with narrowing when the type is genuinely unknown.
- TypeScript strict mode is on — honor it.

---

## State Management

- **Server state**: React Query (`@tanstack/react-query`). Query keys follow `['resource', id?]` convention.
- **Client/UI state**: Zustand stores in `src/store/`.
- Do not duplicate server state in Zustand. React Query is the source of truth for API data.

---

## Service Layer

- Components **never** call `fetch` directly. All API calls go through `src/services/`.
- `src/services/api.ts` is the single `fetch` wrapper — handles base URL, headers, and error parsing.
- Each resource domain gets its own service file (e.g., `seasonService.ts`, `episodeService.ts`).

---

## Styling

- **daisyUI component classes first**, Tailwind utilities to supplement.
- Active theme: `retro`. Configured in `index.css` via `@plugin "daisyui" { themes: retro --default; }`.
- Use semantic daisyUI color tokens (`text-base-content`, `bg-base-100`, `badge-primary`) — never hardcode hex values in className.
- Use the opacity modifier syntax (`border-base-content/20`, `text-base-content/50`) instead of arbitrary rgba values.

---

## Utilities

- Pure formatting and calculation functions live in `src/utils/`.
- Do not inline non-trivial transformations (e.g., date formatting) directly in JSX — extract to a util.

---

## Icons

- SVG icons live in `src/components/icons/` as React components.
- Accept `size` (number) and `className` (string) props.
- Use `fill="currentColor"` for fill-based paths — never `stroke` on a fill-based SVG.
