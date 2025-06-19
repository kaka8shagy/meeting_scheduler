class BookingsController < ApplicationController
  protect_from_forgery with: :null_session

  def create
    user_id = params[:booking][:user_id]
    if user_id.blank? || user_id.empty?
        render json: { errors: ['user_id is required'] }, status: :unprocessable_entity and return
    end
    user_ids = params[:booking][:user_ids]
    if user_ids.blank? || user_ids.empty?
      render json: { errors: ['At least one attendee must be provided.'] }, status: :unprocessable_entity and return
    end
    booking = Booking.new(booking_params)
    if booking.save
        user_ids.each do |user_id|
          Attendee.create(booking: booking, user_id: user_id)
        end
        render json: booking, status: :created
    else
      render json: { errors: booking.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def index
    bookings = Booking.all
    bookings = bookings.by_user(params[:user_id]) if params[:user_id].present?
    bookings = bookings.by_meeting_room(params[:meeting_room_id]) if params[:meeting_room_id].present?
    render json: bookings
  end

  private

  def booking_params
    params.require(:booking).permit(:title, :date, :start_time, :end_time, :room_id, :description, :user_id)
  end
end 