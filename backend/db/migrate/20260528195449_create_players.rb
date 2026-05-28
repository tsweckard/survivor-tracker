class CreatePlayers < ActiveRecord::Migration[8.1]
  def change
    create_table :players do |t|
      t.string :name, null: false
      t.integer :status, null: false, default: 0
      t.references :season, null: false, foreign_key: true
      t.integer :tribe_id
      t.integer :athleticism, null: false
      t.integer :social, null: false
      t.integer :strategic, null: false
      t.integer :likability, null: false
      t.integer :loyalty, null: false

      t.timestamps
    end

    add_index :players, :tribe_id
    add_foreign_key :players, :tribes, column: :tribe_id
  end
end
