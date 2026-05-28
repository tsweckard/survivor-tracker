class CreateAlliances < ActiveRecord::Migration[8.1]
  def change
    create_table :alliances do |t|
      t.string :name, null: false
      t.integer :status, null: false, default: 0
      t.references :season, null: false, foreign_key: true

      t.timestamps
    end
  end
end
