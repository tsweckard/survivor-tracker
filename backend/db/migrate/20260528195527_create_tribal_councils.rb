class CreateTribalCouncils < ActiveRecord::Migration[8.1]
  def change
    create_table :tribal_councils do |t|
      t.references :episode, null: false, foreign_key: true
      t.integer :tribe_id
      t.integer :immunity_winner_id
      t.integer :actual_boot_player_id
      t.text :simulation_results
      t.integer :status, null: false, default: 0

      t.timestamps
    end

    add_index :tribal_councils, :tribe_id
    add_index :tribal_councils, :immunity_winner_id
    add_index :tribal_councils, :actual_boot_player_id
    add_foreign_key :tribal_councils, :tribes, column: :tribe_id
    add_foreign_key :tribal_councils, :players, column: :immunity_winner_id
    add_foreign_key :tribal_councils, :players, column: :actual_boot_player_id
  end
end
