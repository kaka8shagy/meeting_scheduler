import axios from 'axios';

const defaultHeaders = {
  'Content-Type': 'application/json',
  // Add other default headers here if needed (e.g., Authorization)
};

export const fetchUsers = async () => {
  const res = await axios.get('/users', { headers: defaultHeaders });
  return res.data;
};

export const fetchBookings = async () => {
    const res = await axios.get('/bookings', { headers: defaultHeaders });
    return res.data;
  };

export const fetchMeetingRooms = async () => {
  const res = await axios.get('/meeting_rooms', { headers: defaultHeaders });
  return res.data;
};

export const createBooking = async ({ title, start_time, end_time, room_id, description, user_ids, user_id }) => {
  const res = await axios.post(
    '/bookings',
    {
      booking: {
        title,
        start_time,
        end_time,
        room_id,
        description,
        user_ids,
        ...(user_id && { user_id }),
      },
    },
    { headers: defaultHeaders }
  );
  return res.data;
};

// Add more API functions as needed (updateBooking, deleteBooking, etc.) 