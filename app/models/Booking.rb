class Booking < ApplicationRecord
  has_many :attendees
  has_many :users, through: :attendees

  scope :by_user, ->(user_id) {
    joins(:attendees).where(attendees: { user_id: user_id }) if user_id.present?
  }

  scope :by_meeting_room, ->(room_id) {
    where(room_id: room_id) if room_id.present?
  }
end