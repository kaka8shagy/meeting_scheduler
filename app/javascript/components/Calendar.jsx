import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { fetchBookings, updateBooking } from './api';
import { fromUTCToDate, toUTCISO } from './utils/timeUtils';

// Configure moment to use UTC
moment.utc();

const localizer = momentLocalizer(moment);

// Create DnD Calendar
const DnDCalendar = withDragAndDrop(BigCalendar);

const Calendar = ({ selectedDate, onNavigate, onSelectEvent }) => {
  const [view, setView] = useState(Views.DAY);
  const [events, setEvents] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  console.log(events);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const bookings = await fetchBookings();
        console.log('Bookings received:', bookings);
        // Transform bookings to match BigCalendar's event format
        // Ensure all dates are handled in UTC using utility functions
        const events = bookings.map(booking => ({
          id: booking.id,
          title: booking.title,
          start: fromUTCToDate(booking.start_time),
          end: fromUTCToDate(booking.end_time),
          description: booking.description,
          room_id: booking.room_id,
          user_id: booking.user_id,
          attendees: booking.attendees?.map(attendee => attendee.user) || [],
        }));
        console.log('Events created:', events);
        setEvents(events);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };
    loadBookings();
  }, []);

  // Handle event drop (moving events to different times/dates)
  const handleEventDrop = async ({ event, start, end, isAllDay }) => {
    if (isUpdating) return; // Prevent multiple simultaneous updates
    
    setIsUpdating(true);
    try {
      console.log('Event dropped:', { event, start, end, isAllDay });
      
      // Convert the new start and end times to UTC for the API
      const startTimeUTC = toUTCISO(moment(start).format('YYYY-MM-DDTHH:mm'));
      const endTimeUTC = toUTCISO(moment(end).format('YYYY-MM-DDTHH:mm'));
      
      // Update the booking on the server
      const updatedBooking = await updateBooking(event.id, {
        title: event.title,
        start_time: startTimeUTC,
        end_time: endTimeUTC,
        room_id: event.room_id,
        description: event.description,
        user_ids: event.attendees?.map(attendee => attendee.id) || [],
      });
      
      console.log('Booking updated successfully:', updatedBooking);
      
      // Update the local events state
      setEvents(prevEvents => 
        prevEvents.map(evt => 
          evt.id === event.id 
            ? {
                ...evt,
                start: fromUTCToDate(updatedBooking.start_time),
                end: fromUTCToDate(updatedBooking.end_time),
              }
            : evt
        )
      );
      
    } catch (error) {
      console.error('Failed to update booking:', error);
      // Revert the change by reloading events
      const bookings = await fetchBookings();
      const events = bookings.map(booking => ({
        id: booking.id,
        title: booking.title,
        start: fromUTCToDate(booking.start_time),
        end: fromUTCToDate(booking.end_time),
        description: booking.description,
        room_id: booking.room_id,
        user_id: booking.user_id,
        attendees: booking.attendees?.map(attendee => attendee.user) || [],
      }));
      setEvents(events);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle event resize (changing event duration)
  const handleEventResize = async ({ event, start, end }) => {
    if (isUpdating) return; // Prevent multiple simultaneous updates
    
    setIsUpdating(true);
    try {
      console.log('Event resized:', { event, start, end });
      
      // Convert the new start and end times to UTC for the API
      const startTimeUTC = toUTCISO(moment(start).format('YYYY-MM-DDTHH:mm'));
      const endTimeUTC = toUTCISO(moment(end).format('YYYY-MM-DDTHH:mm'));
      
      // Update the booking on the server
      const updatedBooking = await updateBooking(event.id, {
        title: event.title,
        start_time: startTimeUTC,
        end_time: endTimeUTC,
        room_id: event.room_id,
        description: event.description,
        user_ids: event.attendees?.map(attendee => attendee.id) || [],
      });
      
      console.log('Booking updated successfully:', updatedBooking);
      
      // Update the local events state
      setEvents(prevEvents => 
        prevEvents.map(evt => 
          evt.id === event.id 
            ? {
                ...evt,
                start: fromUTCToDate(updatedBooking.start_time),
                end: fromUTCToDate(updatedBooking.end_time),
              }
            : evt
        )
      );
      
    } catch (error) {
      console.error('Failed to update booking:', error);
      // Revert the change by reloading events
      const bookings = await fetchBookings();
      const events = bookings.map(booking => ({
        id: booking.id,
        title: booking.title,
        start: fromUTCToDate(booking.start_time),
        end: fromUTCToDate(booking.end_time),
        description: booking.description,
        room_id: booking.room_id,
        user_id: booking.user_id,
        attendees: booking.attendees?.map(attendee => attendee.user) || [],
      }));
      setEvents(events);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded shadow p-4 min-h-[400px]">
      <DnDCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 800 }}
        views={['month', 'week', 'day']}
        view={view}
        onView={setView}
        date={selectedDate}
        onNavigate={onNavigate}
        onSelectEvent={onSelectEvent}
        // Enable drag and drop functionality
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
        // Enable resizing events
        resizable
        // Enable dragging events
        draggable
        popup
        // Ensure the calendar displays times in UTC
        culture="en"
        messages={{
          today: "Today",
          previous: "Previous",
          next: "Next",
          month: "Month",
          week: "Week",
          day: "Day",
          agenda: "Agenda",
          date: "Date",
          time: "Time",
          event: "Event",
          noEventsInRange: "There are no events in this range.",
        }}
      />
    </div>
  );
};

export default Calendar; 