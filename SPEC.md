# Survivor Game Tracker — MVP Specification

> Version 2.0 | May 2026 | MVP Scope

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Technology Stack](#2-technology-stack)
3. [Data Model](#3-data-model)
4. [Season Setup Flow](#4-season-setup-flow)
5. [Episode Loop](#5-episode-loop)
6. [Simulation Engine](#6-simulation-engine)
7. [Merge Handling](#7-merge-handling)
8. [Post-MVP Phases](#8-post-mvp-phases)

---

## 1. Product Overview

Survivor Game Tracker is a web application for simulating and tracking a Survivor season episode by episode. Users build a cast, assign tribes, and track the game through a repeating episode loop. Before each tribal council the app runs a probabilistic simulation to predict who is most likely to be voted out. Users submit the actual boot after watching and repeat for each episode.

**Core loop:**

```
Season setup → Episode: confirm tribal → manage alliances → run simulation → submit boot → repeat
```

The MVP is the core loop working end to end. Nothing else.

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Backend | Ruby on Rails 8.1 (API mode) |
| Database | SQLite (development) / PostgreSQL (production) |
| Styling | Tailwind CSS |
| State Management | React Query + Zustand |
| API | REST / JSON |

The simulation engine runs server-side in Rails. This keeps the UI responsive and allows the scoring model to evolve independently of the frontend.

---

## 3. Data Model

### Season

| Field | Type | Notes |
|---|---|---|
| `name` | String | e.g. "Survivor: Borneo" |
| `game_phase` | Enum | `pre_merge` \| `merged` \| `final_tribal` |
| `status` | Enum | `setup` \| `active` \| `completed` |

### Tribe

| Field | Type | Notes |
|---|---|---|
| `name` | String | |
| `color` | String | Hex color for UI |
| `status` | Enum | `active` \| `dissolved` |
| `season_id` | FK | |

### Player

| Field | Type | Notes |
|---|---|---|
| `name` | String | |
| `status` | Enum | `active` \| `jury` \| `eliminated` \| `winner` |
| `tribe_id` | FK | Nullable — null post-merge |
| `season_id` | FK | |
| `athleticism` | Integer 1–10 | |
| `social` | Integer 1–10 | |
| `strategic` | Integer 1–10 | |
| `likability` | Integer 1–10 | |
| `loyalty` | Integer 1–10 | |

Player attributes can be updated at any point during the season. Post-merge, `tribe_id` is set to null.

### Alliance

| Field | Type | Notes |
|---|---|---|
| `name` | String | User-defined |
| `status` | Enum | `active` \| `fractured` \| `dissolved` |
| `season_id` | FK | |

### AllianceMembership

| Field | Type | Notes |
|---|---|---|
| `alliance_id` | FK | |
| `player_id` | FK | |
| `majority` | Boolean | Whether this player is in the majority position |

Alliances are created and managed during the episode loop, not during season setup. A player can belong to multiple alliances simultaneously.

### Episode

| Field | Type | Notes |
|---|---|---|
| `episode_number` | Integer | |
| `merge_occurred` | Boolean | Triggers merge cascade when true |
| `tribe_swap_occurred` | Boolean | Informational for now |
| `status` | Enum | `setup` \| `in_progress` \| `completed` |
| `season_id` | FK | |

### TribalCouncil

| Field | Type | Notes |
|---|---|---|
| `episode_id` | FK | |
| `tribe_id` | FK | Nullable — null post-merge and on merge boot |
| `immunity_winner_id` | FK | Nullable — player who won individual immunity |
| `simulation_results` | JSON | Probability distribution output |
| `actual_boot_player_id` | FK | Nullable until boot is submitted |
| `status` | Enum | `pending` \| `simulated` \| `completed` |

---

## 4. Season Setup Flow

Performed once before episode 1. No alliances or relationships at this stage.

1. Create season (name)
2. Create tribes (name, color)
3. Add players (name, tribe assignment, set all 5 attributes)

That's it. The season is ready to play.

---

## 5. Episode Loop

Repeated each episode. Steps are non-linear — the user can revisit any step before running the simulation.

### Step 1 — Episode Setup
- Confirm which tribe is attending tribal council (pre-merge)
- If merge occurred this episode, trigger the merge cascade (see Section 7)
- Confirm active players

### Step 2 — Alliance Management
- Create new alliances formed this episode
- Update existing alliances: add/remove members, flip majority/minority positions
- Mark alliances as fractured or dissolved

### Step 3 — Attribute Updates (optional)
- Update any player attributes that evolved this episode

### Step 4 — Run Simulation
- Confirm immunity winner if applicable (excluded from simulation)
- Trigger simulation — returns probability distribution for all eligible players
- Results display as a probability bar chart with risk tiers:
  - 🔴 Danger (>35%)
  - 🟡 Watch List (15–35%)
  - 🟢 Safe (<15%)

### Step 5 — Submit Boot
- Select the player actually voted out
- Episode marked complete, next episode becomes available

---

## 6. Simulation Engine

### MVP: Weighted Attribute Sum

The MVP simulation scores each eligible player using a weighted sum of their attributes, then normalizes scores into a probability distribution.

```
score = (athleticism × w1) + (social × w2) + (strategic × w3)
      + (likability × w4) + (loyalty × w5)
```

Weights differ by game phase:

| Attribute | Pre-Merge | Post-Merge |
|---|---|---|
| Athleticism | High | Low (liability) |
| Social | Medium | High |
| Strategic | Low | High |
| Likability | Medium | Medium |
| Loyalty | Medium | Medium |

Higher score = higher elimination probability (the house targets threats or weak links depending on phase).

After scoring all eligible players, scores are normalized so they sum to 1.0, producing a probability distribution.

### Eligible Players

- Pre-merge: active players on the tribal tribe only
- Post-merge / merge boot: all active players
- Immunity winner is excluded before scoring

### Phase Transition

When `season.game_phase` transitions to `merged`, the weight profile switches automatically. This is the natural motivation for the Strategy pattern — two swappable algorithms, same interface.

---

## 7. Merge Handling

The merge is triggered when a user marks `merge_occurred: true` on an episode during Step 1.

**Cascade (handled by EpisodeService):**

1. `season.update!(game_phase: :merged)`
2. `season.tribes.update_all(status: :dissolved)`
3. `season.players.active.update_all(tribe_id: nil)`
4. `episode.update!(merge_occurred: true)`

After the cascade, the episode continues normally. A TribalCouncil can still occur that same episode (merge boot) — it will have `tribe_id: null` and all active players are eligible. This requires no special casing; it falls out naturally from the model.

---

## 8. Post-MVP Phases

Features explicitly out of scope for MVP, planned for later phases:

### Phase 2
- Alliance modifiers in simulation (majority/minority affects score)
- Chaos factor (configurable randomness per season)
- Advantage tracking (idols, extra votes — affect simulation via Decorator pattern)
- Snapshot system (lock player state at simulation time for historical accuracy)
- Upset detection (flag when actual boot had <20% predicted probability)
- Scenario testing (what-if simulation runs, not saved as official result)

### Phase 3
- Jury model and final tribal council prediction
- Season history and analytics
- Player arc view (attribute changes over time)
- Prediction accuracy tracking over the season
- Boot order timeline (predicted vs. actual)

### Not in scope
- Confessional tracking
- Edit tracking (winner's edit, etc.)
- Season templates
- Export / share
- Multi-tribal episodes