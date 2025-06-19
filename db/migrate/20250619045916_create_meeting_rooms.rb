class CreateMeetingRooms < ActiveRecord::Migration[8.0]
  def change
    create_table :meeting_rooms do |t|
      t.string :name, null: false, index: { unique: true }
      t.string :location, null: false
      t.integer :capacity, null: false
      t.text :description

      t.timestamps
    end
  end
end
