import React, { useState, useEffect, Fragment } from 'react';
import { fetchUsers, fetchMeetingRooms, createBooking } from './api';
import { Combobox } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';

const MeetingForm = ({ onClose, meeting, onDelete, onUpdate }) => {
  const [title, setTitle] = useState(meeting?.title || '');
  const [startDateTime, setStartDateTime] = useState(meeting?.startDateTime || (meeting?.date && meeting?.startTime ? `${meeting.date}T${meeting.startTime}` : ''));
  const [endDateTime, setEndDateTime] = useState(meeting?.endDateTime || (meeting?.date && meeting?.endTime ? `${meeting.date}T${meeting.endTime}` : ''));
  const [roomId, setRoomId] = useState(meeting?.roomId || '');
  const [attendees, setAttendees] = useState(meeting?.attendees ? meeting.attendees.map(a => typeof a === 'object' ? a : null).filter(Boolean) : []);
  const [description, setDescription] = useState(meeting?.description || '');
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  // Fetch users and rooms
  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch(() => setUsers([]));
    fetchMeetingRooms()
      .then(setRooms)
      .catch(() => setRooms([]));
  }, []);

  // Basic validation
  const validate = () => {
    const errs = {};
    if (!title) errs.title = 'Title is required';
    if (!startDateTime) errs.startDateTime = 'Start date & time is required';
    if (!endDateTime) errs.endDateTime = 'End date & time is required';
    if (!roomId) errs.roomId = 'Meeting room is required';
    if (startDateTime && endDateTime && new Date(endDateTime) <= new Date(startDateTime)) {
      errs.endDateTime = 'End time must be after start time';
    }
    if (attendees.length === 0) errs.attendees = 'At least one attendee required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    // Prepare attendees as array of IDs for backend
    const attendeeIds = attendees.map(a => a.id);
    // Get current user id from meta tag
    const userIdMeta = document.querySelector('meta[name="current-user-id"]');
    const creatorUserId = userIdMeta ? userIdMeta.content : null;
    try {
      await createBooking({
        title,
        start_time: startDateTime,
        end_time: endDateTime,
        room_id: roomId,
        description,
        user_ids: attendeeIds,
        user_id: creatorUserId
      });
      setLoading(false);
      onClose();
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data && error.response.data.errors) {
        // Map API errors to form fields if possible
        const apiErrors = {};
        error.response.data.errors.forEach(err => {
          if (err.toLowerCase().includes('title')) apiErrors.title = err;
          else if (err.toLowerCase().includes('date') || err.toLowerCase().includes('start')) apiErrors.startDateTime = err;
          else if (err.toLowerCase().includes('end')) apiErrors.endDateTime = err;
          else if (err.toLowerCase().includes('room')) apiErrors.roomId = err;
          else if (err.toLowerCase().includes('attendee')) apiErrors.attendees = err;
          else apiErrors.general = err;
        });
        setErrors(apiErrors);
      } else {
        setErrors({ general: 'An error occurred. Please try again.' });
      }
    }
  };

  // Filter users for Combobox
  const filteredUsers = query === '' ? users : users.filter(user =>
    user.name.toLowerCase().includes(query.toLowerCase()) ||
    user.email.toLowerCase().includes(query.toLowerCase())
  );
  console.log('filteredUsers', filteredUsers)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-extrabold mb-6 text-center text-gray-800">{meeting?.id ? 'Edit Meeting' : 'Create Meeting'}</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold mb-1">Title *</label>
            <input type="text" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500" value={title} onChange={e => setTitle(e.target.value)} />
            {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Start Date & Time *</label>
              <input type="datetime-local" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500" value={startDateTime} onChange={e => setStartDateTime(e.target.value)} />
              {errors.startDateTime && <div className="text-red-500 text-sm mt-1">{errors.startDateTime}</div>}
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">End Date & Time *</label>
              <input type="datetime-local" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500" value={endDateTime} onChange={e => setEndDateTime(e.target.value)} />
              {errors.endDateTime && <div className="text-red-500 text-sm mt-1">{errors.endDateTime}</div>}
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Meeting Room *</label>
            <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500" value={roomId} onChange={e => setRoomId(e.target.value)}>
              <option value="">Select a room</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>{room.name}</option>
              ))}
            </select>
            {errors.roomId && <div className="text-red-500 text-sm mt-1">{errors.roomId}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1">Attendees *</label>
            <Combobox multiple value={attendees} onChange={setAttendees} onClose={() => setQuery('')}>
              {attendees.length > 0 && (
                <ul className="mb-2 flex flex-wrap gap-2">
                  {attendees.map((user) => (
                    <li key={user.id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">{user.name}</li>
                  ))}
                </ul>
              )}
              <Combobox.Input
                aria-label="Attendees"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                onChange={e => setQuery(e.target.value)}
                value={query}
                placeholder="Select attendees..."
              />
              <Combobox.Options className="border empty:invisible absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {filteredUsers.length === 0 && query !== '' && (
                  <div className="px-4 py-2 text-gray-500">No users found</div>
                )}
                {filteredUsers.map((user) => (
                  <Combobox.Option key={user.id} value={user} className={({ active }) => `${active ? 'bg-blue-100' : ''} cursor-pointer px-4 py-2`}>
                    {user.name} ({user.email})
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </Combobox>
            {errors.attendees && <div className="text-red-500 text-sm mt-1">{errors.attendees}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1">Description/Notes</label>
            <textarea className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="flex justify-between items-center mt-8">
            <div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow-sm transition" disabled={loading}>
                {meeting?.id ? 'Update' : 'Create'}
              </button>
              <button type="button" className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg font-semibold transition" onClick={onClose}>
                Cancel
              </button>
            </div>
            {meeting?.id && (
              <button type="button" className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-semibold transition" onClick={onDelete}>
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeetingForm; 