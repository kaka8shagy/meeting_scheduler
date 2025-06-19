import React, { useState } from 'react';
import Header from './Header';
import Calendar from './Calendar';
import MeetingForm from './MeetingForm';

const Landing = () => {
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Handler for calendar navigation (e.g., when user clicks next/prev)
  const handleNavigate = (date) => {
    setSelectedDate(date);
  };

  // Handler for date picker
  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 container mx-auto p-4">
        <div className="flex h-full">
          {/* Sidebar */}
          <aside className="w-64 bg-white rounded shadow p-4 flex flex-col gap-6 mr-6">
            <div>
              <label htmlFor="date-picker" className="font-medium block mb-2">Pick a date:</label>
              <input
                id="date-picker"
                type="date"
                value={selectedDate.toISOString().slice(0, 10)}
                onChange={handleDateChange}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
              onClick={() => setShowMeetingForm(true)}
            >
              + Create Meeting
            </button>
          </aside>
          {/* Calendar takes the rest of the space */}
          <div className="flex-1">
            <Calendar selectedDate={selectedDate} onNavigate={handleNavigate} />
          </div>
        </div>
      </main>
      {showMeetingForm && (
        <MeetingForm onClose={() => setShowMeetingForm(false)} />
      )}
    </div>
  );
};

export default Landing; 