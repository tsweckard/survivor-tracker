class TribalCouncil < ApplicationRecord
  enum :status, { pending: 0, simulated: 1, completed: 2 }

  belongs_to :episode
  belongs_to :tribe, optional: true
  belongs_to :immunity_winner, class_name: "Player", foreign_key: :immunity_winner_id, optional: true
  belongs_to :actual_boot_player, class_name: "Player", foreign_key: :actual_boot_player_id, optional: true

  serialize :simulation_results, coder: JSON

  validates :episode_id, presence: true
end
