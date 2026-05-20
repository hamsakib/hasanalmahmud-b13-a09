import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

// ─── Rooms ────────────────────────────────────────────────────────────────────
export const fetchRooms = (params = {}) =>
  api.get('/api/rooms', { params })

export const fetchRoomById = (id) =>
  api.get(`/api/rooms/${id}`)

export const createRoom = (data) =>
  api.post('/api/rooms', data)

export const updateRoom = (id, data) =>
  api.put(`/api/rooms/${id}`, data)

export const deleteRoom = (id) =>
  api.delete(`/api/rooms/${id}`)

export const fetchMyRooms = () =>
  api.get('/api/rooms/my-listings')

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const createBooking = (data) =>
  api.post('/api/bookings', data)

export const fetchMyBookings = () =>
  api.get('/api/bookings/my-bookings')

export const cancelBooking = (id) =>
  api.patch(`/api/bookings/${id}/cancel`)

export default api
