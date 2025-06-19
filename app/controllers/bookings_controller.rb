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

    # Strict end_time validation
    end_time_str = params[:booking][:end_time]
    if end_time_str.blank?
      render json: { errors: ['end_time is required'] }, status: :unprocessable_entity and return
    end
    end_time = Time.parse(end_time_str).utc rescue nil
    if end_time.nil?
      render json: { errors: ['Invalid end_time format'] }, status: :unprocessable_entity and return
    end
    if end_time <= Time.now.utc
      render json: { errors: ['Cannot create a booking with end time in the past'] }, status: :unprocessable_entity and return
    end

    # Conflict checking
    conflicts = find_booking_conflicts(
      room_id: params[:booking][:room_id],
      user_ids: user_ids + [user_id],
      start_time: params[:booking][:start_time],
      end_time: params[:booking][:end_time]
    )
    if conflicts.any?
      render json: { errors: conflicts }, status: :unprocessable_entity and return
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

  # Returns an array of conflict error messages
  def find_booking_conflicts(room_id:, user_ids:, start_time:, end_time:)
    errors = []
    return errors if room_id.blank? || user_ids.blank? || start_time.blank? || end_time.blank?

    start_time = Time.parse(start_time).utc
    end_time = Time.parse(end_time).utc

    # Room conflict
    room_conflicts = Booking.where(room_id: room_id)
      .where.not(id: params[:id])
      .where('start_time < ? AND end_time > ?', end_time, start_time)
    if room_conflicts.exists?
      errors << "Meeting room is already booked for the selected time."
    end

    # User/attendee conflicts
    user_conflicts = Booking.joins(:attendees)
      .where(attendees: { user_id: user_ids })
      .where.not(id: params[:id])
      .where('start_time < ? AND end_time > ?', end_time, start_time)
      .distinct
    if user_conflicts.exists?
      conflicted_users = user_conflicts.map { |b| b.attendees.map(&:user_id) }.flatten.uniq & user_ids.map(&:to_i)
      conflicted_user_names = User.where(id: conflicted_users).pluck(:name)
      errors << "The following users are already booked for another meeting at this time: #{conflicted_user_names.join(', ')}."
    end

    errors
  end
end 