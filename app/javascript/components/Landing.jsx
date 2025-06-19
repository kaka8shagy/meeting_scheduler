import React, { useState } from 'react';
import Header from './Header';
import Calendar from './Calendar';
import MeetingForm from './MeetingForm';

const Landing = () => {
  const [showMeetingForm, setShowMeetingForm] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Your Meetings</h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setShowMeetingForm(true)}
          >
            + Create Meeting
          </button>
        </div>
        <Calendar />
      </main>
      {showMeetingForm && (
        <MeetingForm onClose={() => setShowMeetingForm(false)} />
      )}
    </div>
  );
};

export default Landing; 