class CreateSeasons < ActiveRecord::Migration[8.1]
  def change
    create_table :seasons do |t|
      t.string :name, null: false
      t.integer :game_phase, null: false, default: 0
      t.integer :status, null: false, default: 0

      t.timestamps
    end
  end
end
