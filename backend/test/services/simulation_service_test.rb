require "test_helper"

class SimulationServiceTest < ActiveSupport::TestCase
  def build_season(game_phase:)
    Season.create!(name: "Test Season #{SecureRandom.hex(4)}", game_phase: game_phase, status: :active)
  end

  def build_tribe(season:)
    Tribe.create!(name: "Tribe #{SecureRandom.hex(4)}", color: "#000000", season: season)
  end

  def build_player(season:, tribe: nil, status: :active, **attrs)
    defaults = { athleticism: 5, social: 5, strategic: 5, likability: 5, loyalty: 5 }
    Player.create!(
      name: "Player #{SecureRandom.hex(4)}",
      season: season,
      tribe: tribe,
      status: status,
      **defaults.merge(attrs)
    )
  end

  def build_council(season:, tribe: nil, immunity_winner: nil)
    episode = Episode.create!(season: season, episode_number: 1)
    TribalCouncil.create!(episode: episode, tribe: tribe, immunity_winner: immunity_winner)
  end

  test "pre-merge: only active players on the tribal tribe are eligible" do
    season = build_season(game_phase: :pre_merge)
    tribe_a = build_tribe(season: season)
    tribe_b = build_tribe(season: season)
    in_tribe = build_player(season: season, tribe: tribe_a)
    other_tribe = build_player(season: season, tribe: tribe_b)
    council = build_council(season: season, tribe: tribe_a)

    result = SimulationService.call(council)

    assert_includes result.keys, in_tribe.id
    assert_not_includes result.keys, other_tribe.id
  end

  test "eliminated players are not eligible" do
    season = build_season(game_phase: :pre_merge)
    tribe = build_tribe(season: season)
    active_player = build_player(season: season, tribe: tribe)
    eliminated_player = build_player(season: season, tribe: tribe, status: :eliminated)
    council = build_council(season: season, tribe: tribe)

    result = SimulationService.call(council)

    assert_includes result.keys, active_player.id
    assert_not_includes result.keys, eliminated_player.id
  end

  test "immunity winner is excluded from the results" do
    season = build_season(game_phase: :pre_merge)
    tribe = build_tribe(season: season)
    winner = build_player(season: season, tribe: tribe)
    other = build_player(season: season, tribe: tribe)
    council = build_council(season: season, tribe: tribe, immunity_winner: winner)

    result = SimulationService.call(council)

    assert_not_includes result.keys, winner.id
    assert_includes result.keys, other.id
  end

  test "post-merge: all active players are eligible regardless of tribe" do
    season = build_season(game_phase: :merged)
    tribe = build_tribe(season: season)
    with_tribe = build_player(season: season, tribe: tribe)
    without_tribe = build_player(season: season, tribe: nil)
    council = build_council(season: season, tribe: nil)

    result = SimulationService.call(council)

    assert_includes result.keys, with_tribe.id
    assert_includes result.keys, without_tribe.id
  end

  test "probabilities sum to 1.0" do
    season = build_season(game_phase: :pre_merge)
    tribe = build_tribe(season: season)
    build_player(season: season, tribe: tribe, athleticism: 8)
    build_player(season: season, tribe: tribe, athleticism: 3)
    build_player(season: season, tribe: tribe, athleticism: 6)
    council = build_council(season: season, tribe: tribe)

    result = SimulationService.call(council)

    assert_in_delta 1.0, result.values.sum, 0.0001
  end

  test "single eligible player gets probability 1.0" do
    season = build_season(game_phase: :pre_merge)
    tribe = build_tribe(season: season)
    only_player = build_player(season: season, tribe: tribe)
    council = build_council(season: season, tribe: tribe)

    result = SimulationService.call(council)

    assert_equal({ only_player.id => 1.0 }, result)
  end

  test "pre-merge weights favor athleticism over strategic" do
    season = build_season(game_phase: :pre_merge)
    tribe = build_tribe(season: season)
    athletic = build_player(season: season, tribe: tribe, athleticism: 10, strategic: 1)
    strategic = build_player(season: season, tribe: tribe, athleticism: 1, strategic: 10)
    council = build_council(season: season, tribe: tribe)

    result = SimulationService.call(council)

    assert_operator result[athletic.id], :>, result[strategic.id]
  end

  test "post-merge weights favor strategic over athleticism" do
    season = build_season(game_phase: :merged)
    athletic = build_player(season: season, athleticism: 10, strategic: 1)
    strategic = build_player(season: season, athleticism: 1, strategic: 10)
    council = build_council(season: season, tribe: nil)

    result = SimulationService.call(council)

    assert_operator result[strategic.id], :>, result[athletic.id]
  end
end
