class Episode < ApplicationRecord
  enum :status, { setup: 0, in_progress: 1, completed: 2 }

  belongs_to :season
  has_many :tribal_councils, dependent: :destroy

  validates :episode_number, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :season_id, presence: true
end
