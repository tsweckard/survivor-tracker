class Tribe < ApplicationRecord
  enum :status, { active: 0, dissolved: 1 }

  belongs_to :season
  has_many :players

  validates :name, presence: true
  validates :color, presence: true
  validates :season_id, presence: true
end
