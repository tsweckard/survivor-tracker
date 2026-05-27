# CLAUDE.md — Survivor Game Tracker Development Reference

This file is the persistent context for Claude Code sessions on this project.
Read this before touching any code.

---

## What This Project Is

A Survivor season tracker with a probabilistic simulation engine. Users set up a cast,
track episodes, run simulations before each tribal council, and submit actual boots.
The core loop is the product.

This project is also a deliberate learning exercise for Gang of Four design patterns.
Patterns are introduced when they solve a real pain point — not on a schedule.

**Full product spec:** `SPEC.md`

---

## Technology Stack

- **Backend:** Ruby on Rails 8.1 (API mode), port 3001
- **Frontend:** React 19 + TypeScript + Vite, port 5173
- **Database:** SQLite (development), PostgreSQL (production)
- **Styling:** Tailwind CSS
- **State Management:** React Query + Zustand

---

## Current Phase: MVP (Phase 1)

The MVP is the core loop working end to end:

```
Season setup → Episode loop → Simulation → Submit boot → Repeat
```

Do not build Phase 2 or Phase 3 features during MVP work. See SPEC.md §8 for what
is explicitly deferred.

---

## Architecture Principles

### 1. Thin controllers, fat services
Rails controllers do almost nothing. Business logic lives in service objects.
The episode workflow is coordinated by `EpisodeService` (a Facade). Controllers
call services; they do not orchestrate model updates directly.

### 2. The simulation is a black box with a clean interface
`SimulationService` takes a `TribalCouncil` and returns a probability distribution.
Callers do not know or care how scoring works internally. This boundary must be
maintained — it's what allows the scoring model to evolve in Phase 2 without
touching controllers or UI code.

### 3. No versioning until Phase 2
The snapshot system (locking player state at simulation time) is a Phase 2 feature.
Do not add it during MVP work. Player attributes are mutable and updates affect
the current state only.

### 4. Alliances are episodic, not setup-time
Alliances are created and managed during the episode loop. Season setup only
covers season → tribes → players. Do not add alliance management to the setup flow.

---

## Data Model Summary

```
Season
  has_many :tribes
  has_many :players
  has_many :episodes

Tribe
  belongs_to :season
  has_many :players
  status: active | dissolved

Player
  belongs_to :season
  belongs_to :tribe (nullable — null post-merge)
  status: active | jury | eliminated | winner
  attributes: athleticism, social, strategic, likability, loyalty (all 1–10)

Alliance
  belongs_to :season
  has_many :alliance_memberships
  has_many :players, through: :alliance_memberships
  status: active | fractured | dissolved

AllianceMembership
  belongs_to :alliance
  belongs_to :player
  majority: boolean

Episode
  belongs_to :season
  has_many :tribal_councils
  merge_occurred: boolean (triggers merge cascade when true)
  status: setup | in_progress | completed

TribalCouncil
  belongs_to :episode
  belongs_to :tribe (nullable)
  belongs_to :immunity_winner, class_name: 'Player' (nullable)
  simulation_results: JSON
  actual_boot_player_id: FK (nullable until boot submitted)
  status: pending | simulated | completed
```

---

## Merge Handling

Merge is triggered when `episode.merge_occurred` is set to true. The cascade is
handled entirely by `EpisodeService#apply_merge`:

1. `season.update!(game_phase: :merged)`
2. `season.tribes.update_all(status: :dissolved)`
3. `season.players.active.update_all(tribe_id: nil)`
4. `episode.update!(merge_occurred: true)`

A TribalCouncil can occur on the merge episode (merge boot). It will have
`tribe_id: null` and all active players are eligible. No special casing needed.

---

## Simulation Engine (MVP)

Weighted attribute sum, normalized to a probability distribution.

```ruby
score = (athleticism × w1) + (social × w2) + (strategic × w3)
      + (likability × w4) + (loyalty × w5)
```

**Pre-merge weights:** athleticism high, strategic low
**Post-merge weights:** athleticism low (liability), strategic high, perceived threat high

After scoring all eligible players, normalize so scores sum to 1.0.

Eligible players:
- Pre-merge: active players on the tribal tribe
- Post-merge / merge boot: all active players
- Immunity winner always excluded

**File location:** `app/services/simulation_service.rb`

---

## Design Patterns — Status and Plan

Patterns are introduced when they solve a real, felt pain. Do not introduce a pattern
preemptively.

| Pattern | Status | Trigger |
|---|---|---|
| **Facade** | Planned — Phase 1 | Episode workflow coordinates 5+ models. Lives in `EpisodeService`. |
| **Strategy** | Planned — Phase 1 | Post-merge scoring needs a different algorithm. `PreMergeStrategy` / `PostMergeStrategy`. |
| **State** | Planned — Phase 1 | Player lifecycle transitions need guards. Use AASM or a simple custom state machine. |
| **Decorator** | Planned — Phase 2 | Advantages (idol plays, immunity) modify player scores without changing base scorer. |
| **Observer** | Planned — Phase 2 | Simulation run triggers snapshot + accuracy tracking. Decouple with events. |

When a pattern is implemented, document it in `PATTERNS.md` (see below).

---

## PATTERNS.md

Maintain a `PATTERNS.md` in the repo root. When a pattern is implemented, add an entry:

```markdown
## Pattern Name
- **Problem it solved:** specific description from this codebase
- **Where it lives:** file paths
- **What we avoided:** the naive approach that would have caused pain
- **Any friction:** places it felt forced or over-engineered
```

---

## File Structure

```
├── backend/
│   ├── app/
│   │   ├── controllers/api/v1/    # Thin — call services, return JSON
│   │   ├── models/                # Associations, validations, state machines
│   │   └── services/              # Business logic
│   │       ├── episode_service.rb         # Facade — episode workflow
│   │       └── simulation_service.rb      # Black box — scoring engine
│   └── db/migrations/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/              # API client — components never call API directly
│   │   ├── store/                 # Zustand
│   │   └── types/                 # TypeScript definitions
├── SPEC.md                        # Product specification
├── CLAUDE.md                      # This file
└── PATTERNS.md                    # Pattern implementation log (create when first pattern lands)
```

---

## Build Order (MVP)

1. Rails models + migrations (Season, Tribe, Player, Alliance, AllianceMembership, Episode, TribalCouncil)
2. Season setup API + UI (create season, tribes, players)
3. Basic simulation engine (weighted sum, no patterns yet — just make it work)
4. Episode workflow UI + EpisodeService Facade (first pattern)
5. Post-merge scoring — Strategy pattern emerges here
6. Player state machine — State pattern emerges here

Steps 1–3 are straightforward Rails and React. Patterns arrive in steps 4–6 when
the complexity is real. Do not reach for patterns in steps 1–3.

---

## Conventions

- API routes namespaced under `/api/v1/`
- React components never call the API directly — always go through a service layer in `src/services/`
- Keep Rails controllers to <10 lines where possible
- Every model has validations before any endpoint is built against it
- TypeScript strict mode — no `any`