class SimulationService
  PRE_MERGE_WEIGHTS = {
    athleticism: 3,
    social: 2,
    strategic: 1,
    likability: 2,
    loyalty: 2
  }.freeze

  POST_MERGE_WEIGHTS = {
    athleticism: 1,
    social: 3,
    strategic: 3,
    likability: 2,
    loyalty: 2
  }.freeze

  def self.call(tribal_council)
    new(tribal_council).call
  end

  def initialize(tribal_council)
    @tribal_council = tribal_council
    @season = tribal_council.episode.season
  end

  def call
    scores = eligible_players.index_by(&:id).transform_values { |player| score(player) }
    total = scores.values.sum.to_f

    scores.transform_values { |s| s / total }
  end

  private

  attr_reader :tribal_council, :season

  def eligible_players
    pool = tribal_council.tribe.present? ? tribal_council.tribe.players : season.players
    pool.active.reject { |player| player.id == tribal_council.immunity_winner_id }
  end

  def weight_profile
    season.pre_merge? ? PRE_MERGE_WEIGHTS : POST_MERGE_WEIGHTS
  end

  def score(player)
    weight_profile.sum { |attribute, weight| player.public_send(attribute) * weight }
  end
end
