class CreateEpisodes < ActiveRecord::Migration[8.1]
  def change
    create_table :episodes do |t|
      t.integer :episode_number, null: false
      t.boolean :merge_occurred, null: false, default: false
      t.boolean :tribe_swap_occurred, null: false, default: false
      t.integer :status, null: false, default: 0
      t.references :season, null: false, foreign_key: true

      t.timestamps
    end
  end
end
