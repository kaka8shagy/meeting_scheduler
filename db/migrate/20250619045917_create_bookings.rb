class CreateBookings < ActiveRecord::Migration[8.0]
  def change
    create_table :bookings do |t|
      # Foreign key to the meeting room being booked
      t.references :room, null: false, foreign_key: { to_table: :meeting_rooms }
      # Foreign key to the user who created the booking
      t.references :user, null: false, foreign_key: true

      t.string :title, null: false
      t.datetime :start_time, null: false
      t.datetime :end_time, null: false
      t.text :description
      t.string :status, null: false, default: 'confirmed' # e.g., 'confirmed', 'pending', 'cancelled'

      t.timestamps
    end

    # Add indexes for efficient querying of bookings by time
    add_index :bookings, :start_time
    add_index :bookings, :end_time
  end
end