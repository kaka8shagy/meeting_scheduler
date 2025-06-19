class User < ApplicationRecord
    has_secure_password
    validates :email, presence: true, uniqueness: true
    validates :name, presence: true
    has_many :attendees
    has_many :bookings, through: :attendees
  end