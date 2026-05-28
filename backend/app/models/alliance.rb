class Alliance < ApplicationRecord
  enum :status, { active: 0, fractured: 1, dissolved: 2 }

  belongs_to :season
  has_many :alliance_memberships, dependent: :destroy
  has_many :players, through: :alliance_memberships

  validates :name, presence: true
  validates :season_id, presence: true
end
