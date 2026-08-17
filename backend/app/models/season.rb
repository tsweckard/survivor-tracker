class Season < ApplicationRecord
  enum :game_phase, { pre_merge: 0, merged: 1, final_tribal: 2 }
  enum :status, { setup: 0, active: 1, completed: 2 }

  has_many :tribes, dependent: :destroy
  has_many :players, dependent: :destroy
  has_many :episodes, dependent: :destroy
  has_many :alliances, dependent: :destroy

  validates :name, presence: true
  validates :game_phase, presence: true
  validates :status, presence: true
  validates :season_number, uniqueness: true, allow_nil: true
  validates :ended_on, absence: true, unless: :completed?
end
