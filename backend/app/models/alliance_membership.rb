class AllianceMembership < ApplicationRecord
  belongs_to :alliance
  belongs_to :player

  validates :alliance_id, presence: true
  validates :player_id, presence: true, uniqueness: { scope: :alliance_id }
end
