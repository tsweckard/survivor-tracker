class Player < ApplicationRecord
  enum :status, { active: 0, jury: 1, eliminated: 2, winner: 3 }

  belongs_to :season
  belongs_to :tribe, optional: true
  has_many :alliance_memberships, dependent: :destroy
  has_many :alliances, through: :alliance_memberships

  validates :name, presence: true
  validates :season_id, presence: true
  validates :athleticism, presence: true, inclusion: { in: 1..10 }
  validates :social, presence: true, inclusion: { in: 1..10 }
  validates :strategic, presence: true, inclusion: { in: 1..10 }
  validates :likability, presence: true, inclusion: { in: 1..10 }
  validates :loyalty, presence: true, inclusion: { in: 1..10 }
end
