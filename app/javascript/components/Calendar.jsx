import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { fetchBookings } from './api';
import { fromUTCToDate } from './utils/timeUtils';

// Configure moment to use UTC
moment.utc();

const localizer = momentLocalizer(moment);

const Calendar = ({ selectedDate, onNavigate, onSelectEvent }) => {
  const [view, setView] = useState(Views.DAY);
  const [events, setEvents] = useState([]);
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

  return (
    <div className="bg-white rounded shadow p-4 min-h-[400px]">
      <BigCalendar
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