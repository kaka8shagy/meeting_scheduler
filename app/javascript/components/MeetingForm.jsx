import React from 'react';

const MeetingForm = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Create Meeting</h2>
        <div className="text-gray-400">[Meeting form will go here]</div>
      </div>
    </div>
  );
};

export default MeetingForm; 