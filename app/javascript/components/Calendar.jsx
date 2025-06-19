import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { fetchBookings } from './api';

const localizer = momentLocalizer(moment);

const Calendar = ({ selectedDate, onNavigate }) => {
  const [view, setView] = useState(Views.DAY);
  const [events, setEvents] = useState([]);
  console.log(events);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const bookings = await fetchBookings();
        // Transform bookings to match BigCalendar's event format
        const events = bookings.map(booking => ({
          id: booking.id,
          title: booking.title,
          start: new Date(booking.start_time),
          end: new Date(booking.end_time),
          description: booking.description,
          room_id: booking.room_id,
          user_id: booking.user_id,
        }));
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
        popup
      />
    </div>
  );
};

export default Calendar; 