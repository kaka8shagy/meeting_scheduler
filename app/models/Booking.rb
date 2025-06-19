class Booking < ApplicationRecord
  belongs_to :user
  has_many :attendees, dependent: :destroy
  has_many :users, through: :attendees

  # Ensure all datetime fields are handled in UTC
  before_save :ensure_utc_times
  before_update :ensure_utc_times

  validates :start_time, presence: true
  validates :end_time, presence: true
  validate :end_time_after_start_time

  scope :by_user, ->(user_id) {
    joins(:attendees).where(attendees: { user_id: user_id }) if user_id.present?
  }

  scope :by_meeting_room, ->(room_id) {
    where(room_id: room_id) if room_id.present?
  }

  scope :by_creator, ->(user_id) {
    where(user_id: user_id) if user_id.present?
  }

  private

  def ensure_utc_times
    # Convert times to UTC if they're not already
    self.start_time = start_time.utc if start_time.present?
    self.end_time = end_time.utc if end_time.present?
  end

  def end_time_after_start_time
    return unless start_time.present? && end_time.present?
    
    if end_time <= start_time
      errors.add(:end_time, "must be after start time")
    end
  end
end