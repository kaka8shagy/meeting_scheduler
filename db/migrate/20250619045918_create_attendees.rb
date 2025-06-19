class CreateAttendees < ActiveRecord::Migration[8.0]
  def change
    create_table :attendees do |t|
      # Foreign key to the specific booking
      t.references :booking, null: false, foreign_key: true
      # Foreign key to the user attending the booking
      t.references :user, null: false, foreign_key: true
      t.string :status, null: false, default: 'pending' # e.g., 'accepted', 'declined', 'pending'

      t.timestamps
    end

    # Ensure a user can only be listed once per booking
    add_index :attendees, [:booking_id, :user_id], unique: true
  end
end