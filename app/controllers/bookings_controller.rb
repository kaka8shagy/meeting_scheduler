class BookingsController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :set_booking, only: [:update, :destroy]
  before_action :authorize_booking_owner, only: [:update, :destroy]

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
        render json: booking_with_attendees_json(booking), status: :created
    else
      render json: { errors: booking.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def index
    bookings = Booking.includes(:attendees, :users)
    bookings = bookings.by_user(params[:user_id]) if params[:user_id].present?
    bookings = bookings.by_meeting_room(params[:meeting_room_id]) if params[:meeting_room_id].present?
    
    render json: bookings.map { |booking| booking_with_attendees_json(booking) }
  end

  def update
    user_ids = params[:booking][:user_ids]
    if user_ids.blank? || user_ids.empty?
      render json: { errors: ['At least one attendee must be provided.'] }, status: :unprocessable_entity and return
    end

    # Clear existing attendees and create new ones
    @booking.attendees.destroy_all
    user_ids.each do |user_id|
      Attendee.create(booking: @booking, user_id: user_id)
    end

    if @booking.update(booking_params)
      render json: booking_with_attendees_json(@booking)
    else
      render json: { errors: @booking.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @booking.destroy
    render json: { message: 'Booking deleted successfully' }
  end

  private

  def set_booking
    @booking = Booking.includes(:attendees, :users).find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { errors: ['Booking not found'] }, status: :not_found
  end

  def authorize_booking_owner
    # Get current user from session
    unless current_user && @booking.user_id == current_user.id
      render json: { errors: ['You are not authorized to perform this action'] }, status: :forbidden
    end
  end

  def booking_params
    # Parse and convert datetime parameters to UTC
    params_hash = params.require(:booking).permit(:title, :start_time, :end_time, :room_id, :description, :user_id)
    
    # Convert datetime strings to UTC if present
    if params_hash[:start_time].present?
      params_hash[:start_time] = Time.parse(params_hash[:start_time]).utc
    end
    
    if params_hash[:end_time].present?
      params_hash[:end_time] = Time.parse(params_hash[:end_time]).utc
    end
    
    params_hash
  end

  def booking_with_attendees_json(booking)
    booking.as_json(include: { 
      attendees: { 
        include: { 
          user: { only: [:id, :name, :email] } 
        } 
      } 
    })
  end
end 