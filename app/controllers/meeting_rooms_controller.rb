class MeetingRoomsController < ApplicationController
    def index
      # Optionally filter by date/time params in the future
      meeting_rooms = MeetingRoom.all
      render json: meeting_rooms.select(:id, :name)
    end
  end