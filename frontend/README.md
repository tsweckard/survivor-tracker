# Survivor Tracker — Frontend

React 19 + TypeScript + Vite UI for the Survivor season tracker. Runs on port 5173.

## Requirements

- Node 18+

## Setup

```bash
npm install
```

## Running

```bash
npm run dev
# App available at http://localhost:5173
```

## Stack

| | |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS |
| Server state | React Query |
| Client state | Zustand |

## Key files

- `src/components/` — UI components
- `src/services/` — API client (components never call the API directly)
- `src/store/` — Zustand stores
- `src/types/` — TypeScript type definitions
