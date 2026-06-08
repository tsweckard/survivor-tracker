class AddMetadataToSeasons < ActiveRecord::Migration[8.1]
  def change
    add_column :seasons, :season_number, :integer
    add_column :seasons, :location, :string
    add_column :seasons, :premiered_on, :date
    add_column :seasons, :ended_on, :date
  end
end
