# Survivor Tracker — Backend

Rails 8.1 API serving the Survivor season tracker. Runs on port 3001.

## Requirements

- Ruby 3.3.6 (managed via rbenv)
- Bundler

## Setup

```bash
bundle install
bin/rails db:migrate
bin/rails db:seed   # optional: loads a test season with 2 tribes + 8 players
```

## Running

```bash
bin/rails server
# API available at http://localhost:3001
```

## Stack

| | |
|---|---|
| Framework | Rails 8.1 (API mode) |
| Database | SQLite (development) |
| Web server | Puma |

## Key files

- `app/models/` — Season, Tribe, Player, Alliance, AllianceMembership, Episode, TribalCouncil
- `app/services/` — business logic (EpisodeService, SimulationService — added in later phases)
- `app/controllers/api/v1/` — thin controllers, added as API endpoints are built
- `config/initializers/cors.rb` — allows requests from `localhost:5173`
