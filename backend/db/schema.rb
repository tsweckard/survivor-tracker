# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_05_28_195527) do
  create_table "alliance_memberships", force: :cascade do |t|
    t.integer "alliance_id", null: false
    t.datetime "created_at", null: false
    t.boolean "majority", default: false, null: false
    t.integer "player_id", null: false
    t.datetime "updated_at", null: false
    t.index ["alliance_id", "player_id"], name: "index_alliance_memberships_on_alliance_id_and_player_id", unique: true
    t.index ["alliance_id"], name: "index_alliance_memberships_on_alliance_id"
    t.index ["player_id"], name: "index_alliance_memberships_on_player_id"
  end

  create_table "alliances", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.integer "season_id", null: false
    t.integer "status", default: 0, null: false
    t.datetime "updated_at", null: false
    t.index ["season_id"], name: "index_alliances_on_season_id"
  end

  create_table "episodes", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "episode_number", null: false
    t.boolean "merge_occurred", default: false, null: false
    t.integer "season_id", null: false
    t.integer "status", default: 0, null: false
    t.boolean "tribe_swap_occurred", default: false, null: false
    t.datetime "updated_at", null: false
    t.index ["season_id"], name: "index_episodes_on_season_id"
  end

  create_table "players", force: :cascade do |t|
    t.integer "athleticism", null: false
    t.datetime "created_at", null: false
    t.integer "likability", null: false
    t.integer "loyalty", null: false
    t.string "name", null: false
    t.integer "season_id", null: false
    t.integer "social", null: false
    t.integer "status", default: 0, null: false
    t.integer "strategic", null: false
    t.integer "tribe_id"
    t.datetime "updated_at", null: false
    t.index ["season_id"], name: "index_players_on_season_id"
    t.index ["tribe_id"], name: "index_players_on_tribe_id"
  end

  create_table "seasons", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "game_phase", default: 0, null: false
    t.string "name", null: false
    t.integer "status", default: 0, null: false
    t.datetime "updated_at", null: false
  end

  create_table "tribal_councils", force: :cascade do |t|
    t.integer "actual_boot_player_id"
    t.datetime "created_at", null: false
    t.integer "episode_id", null: false
    t.integer "immunity_winner_id"
    t.text "simulation_results"
    t.integer "status", default: 0, null: false
    t.integer "tribe_id"
    t.datetime "updated_at", null: false
    t.index ["actual_boot_player_id"], name: "index_tribal_councils_on_actual_boot_player_id"
    t.index ["episode_id"], name: "index_tribal_councils_on_episode_id"
    t.index ["immunity_winner_id"], name: "index_tribal_councils_on_immunity_winner_id"
    t.index ["tribe_id"], name: "index_tribal_councils_on_tribe_id"
  end

  create_table "tribes", force: :cascade do |t|
    t.string "color", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.integer "season_id", null: false
    t.integer "status", default: 0, null: false
    t.datetime "updated_at", null: false
    t.index ["season_id"], name: "index_tribes_on_season_id"
  end

  add_foreign_key "alliance_memberships", "alliances"
  add_foreign_key "alliance_memberships", "players"
  add_foreign_key "alliances", "seasons"
  add_foreign_key "episodes", "seasons"
  add_foreign_key "players", "seasons"
  add_foreign_key "players", "tribes"
  add_foreign_key "tribal_councils", "episodes"
  add_foreign_key "tribal_councils", "players", column: "actual_boot_player_id"
  add_foreign_key "tribal_councils", "players", column: "immunity_winner_id"
  add_foreign_key "tribal_councils", "tribes"
  add_foreign_key "tribes", "seasons"
end
