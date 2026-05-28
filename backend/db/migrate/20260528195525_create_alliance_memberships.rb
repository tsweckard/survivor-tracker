class CreateAllianceMemberships < ActiveRecord::Migration[8.1]
  def change
    create_table :alliance_memberships do |t|
      t.references :alliance, null: false, foreign_key: true
      t.references :player, null: false, foreign_key: true
      t.boolean :majority, null: false, default: false

      t.timestamps
    end

    add_index :alliance_memberships, [:alliance_id, :player_id], unique: true
  end
end
