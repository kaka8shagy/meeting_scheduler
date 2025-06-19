import React, { useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

// Placeholder events
const events = [
  {
    id: 0,
    title: 'Board Meeting',
    start: new Date(),
    end: moment().add(1, 'hour').toDate(),
    allDay: false,
  },
];

const Calendar = () => {
  const [view, setView] = useState(Views.MONTH);

  return (
    <div className="bg-white rounded shadow p-4 min-h-[400px]">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        views={['month', 'week', 'day']}
        view={view}
        onView={setView}
        popup
      />
    </div>
  );
};

export default Calendar; 