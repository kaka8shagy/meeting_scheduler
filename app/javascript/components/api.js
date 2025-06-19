import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Always send cookies
});

// Add a request interceptor to set CSRF token on every request
api.interceptors.request.use((config) => {
  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (token) {
    config.headers['X-CSRF-Token'] = token;
  }
  return config;
});

export const fetchUsers = async () => {
  const res = await api.get('/users');
  return res.data;
};

export const fetchBookings = async () => {
  const res = await api.get('/bookings');
  return res.data;
};

export const fetchMeetingRooms = async () => {
  const res = await api.get('/meeting_rooms');
  return res.data;
};

export const createBooking = async ({ title, start_time, end_time, room_id, description, user_ids, user_id }) => {
  const res = await api.post(
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
    }
  );
  return res.data;
};

export const updateBooking = async (bookingId, { title, start_time, end_time, room_id, description, user_ids }) => {
  const res = await api.put(
    `/bookings/${bookingId}`,
    {
      booking: {
        title,
        start_time,
        end_time,
        room_id,
        description,
        user_ids,
      }
    }
  );
  return res.data;
};

export const deleteBooking = async (bookingId) => {
  const res = await api.delete(`/bookings/${bookingId}`);
  return res.data;
};

export const logout = async () => {
  await api.delete('/logout', {
    headers: {
      'Accept': 'text/html',
    },
  });
};

// Add more API functions as needed (updateBooking, deleteBooking, etc.) 