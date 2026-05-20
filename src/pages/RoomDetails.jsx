import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { fetchRoomById, updateRoom, deleteRoom, createBooking } from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ConfirmModal from '../components/ConfirmModal'
import {
  HiOutlineUsers,
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlineCheckCircle,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineBookmark,
  HiOutlineBookOpen,
} from 'react-icons/hi'

const AMENITY_OPTIONS = [
  'Whiteboard', 'Projector', 'Wi-Fi', 'Power Outlets', 'Quiet Zone', 'Air Conditioning',
]

const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00']

export default function RoomDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)

  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookDate, setBookDate] = useState(null)
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [specialNote, setSpecialNote] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)

  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [editLoading, setEditLoading] = useState(false)

  const [deleteOpen, setDeleteOpen] = useState(false)

  useEffect(() => {
    fetchRoomById(id)
      .then(res => setRoom(res.data))
      .catch(() => navigate('/404'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const isOwner = user && room && room.ownerEmail === user.email

  // Booking
  const totalCost = () => {
    if (!startTime || !endTime) return 0
    const sh = parseInt(startTime)
    const eh = parseInt(endTime)
    return Math.max(0, (eh - sh) * (room?.hourlyRate || 0))
  }

  const endTimeOptions = TIME_SLOTS.filter(t => parseInt(t) > parseInt(startTime || '07:00'))

  const handleBook = async e => {
    e.preventDefault()
    if (!bookDate || !startTime || !endTime) {
      toast.error('Please fill in all booking fields')
      return
    }
    setBookingLoading(true)
    try {
      await createBooking({
        roomId: id,
        date: bookDate.toISOString().split('T')[0],
        startTime,
        endTime,
        totalCost: totalCost(),
        specialNote,
      })
      toast.success('Room booked successfully!')
      setBookingOpen(false)
      setBookDate(null)
      setStartTime('')
      setEndTime('')
      setSpecialNote('')
      // bump booking count locally
      setRoom(r => ({ ...r, bookingCount: (r.bookingCount || 0) + 1 }))
    } catch (err) {
      const msg = err.response?.data?.error || 'Booking failed. Please try again.'
      toast.error(msg)
    } finally {
      setBookingLoading(false)
    }
  }

  // Edit
  const openEdit = () => {
    setEditForm({
      name: room.name,
      description: room.description,
      image: room.image,
      floor: room.floor,
      capacity: room.capacity,
      hourlyRate: room.hourlyRate,
      amenities: [...(room.amenities || [])],
    })
    setEditOpen(true)
  }

  const handleEditChange = e => {
    const { name, value } = e.target
    setEditForm(f => ({ ...f, [name]: value }))
  }

  const toggleEditAmenity = a => {
    setEditForm(f => {
      const list = f.amenities || []
      return {
        ...f,
        amenities: list.includes(a) ? list.filter(x => x !== a) : [...list, a],
      }
    })
  }

  const handleEditSubmit = async e => {
    e.preventDefault()
    setEditLoading(true)
    try {
      const res = await updateRoom(id, editForm)
      setRoom(res.data)
      setEditOpen(false)
      toast.success('Room updated successfully')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update room')
    } finally {
      setEditLoading(false)
    }
  }

  // Delete
  const handleDelete = async () => {
    try {
      await deleteRoom(id)
      toast.success('Room deleted successfully')
      navigate('/my-listings')
    } catch {
      toast.error('Failed to delete room')
    }
  }

  if (loading) return <LoadingSpinner fullPage />
  if (!room) return null

  return (
    <>
      <Helmet>
        <title>StudyNook – {room.name}</title>
      </Helmet>

      <div className="pt-16 min-h-screen bg-slate-50 dark:bg-slate-900">
        {/* Hero image */}
        <div className="h-72 md:h-96 overflow-hidden relative">
          <img
            src={room.image || 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200'}
            alt={room.name}
            className="w-full h-full object-cover"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-end justify-between">
              <div>
                <span className="badge badge-amber mb-2">
                  <HiOutlineBookmark className="w-3 h-3" />
                  {room.bookingCount || 0} bookings
                </span>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-white">{room.name}</h1>
              </div>
              {isOwner && (
                <div className="flex gap-2">
                  <button
                    onClick={openEdit}
                    className="flex items-center gap-1.5 bg-white/90 hover:bg-white text-navy-900 text-sm font-semibold px-4 py-2 rounded-lg transition"
                  >
                    <HiOutlinePencil className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteOpen(true)}
                    className="flex items-center gap-1.5 bg-red-500/90 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Meta chips */}
              <div className="flex flex-wrap gap-3">
                <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg text-sm">
                  <HiOutlineLocationMarker className="text-amber-500 w-4 h-4" />
                  {room.floor}
                </span>
                <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg text-sm">
                  <HiOutlineUsers className="text-amber-500 w-4 h-4" />
                  Up to {room.capacity} people
                </span>
                <span className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-lg text-sm font-bold">
                  <HiOutlineCurrencyDollar className="w-4 h-4" />
                  ৳{room.hourlyRate}/hr
                </span>
              </div>

              {/* Description */}
              <div className="card p-6">
                <h2 className="font-display text-xl font-bold text-navy-900 dark:text-white mb-3">About this Room</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{room.description}</p>
              </div>

              {/* Amenities */}
              {room.amenities?.length > 0 && (
                <div className="card p-6">
                  <h2 className="font-display text-xl font-bold text-navy-900 dark:text-white mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {room.amenities.map(a => (
                      <div key={a} className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-sm">
                        <HiOutlineCheckCircle className="text-emerald-500 w-5 h-5 flex-shrink-0" />
                        {a}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Owner info */}
              <div className="card p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <HiOutlineBookOpen className="text-amber-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Listed by</p>
                  <p className="font-semibold text-navy-900 dark:text-white">{room.ownerName}</p>
                  <p className="text-xs text-slate-500">{room.ownerEmail}</p>
                </div>
              </div>
            </div>

            {/* Right: Book card */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-20">
                <div className="text-center mb-5">
                  <span className="font-display text-3xl font-bold text-amber-500">৳{room.hourlyRate}</span>
                  <span className="text-slate-400 text-sm"> / hour</span>
                </div>

                {user ? (
                  <button
                    onClick={() => setBookingOpen(true)}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <HiOutlineCalendar className="w-4 h-4" />
                    Book Now
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="btn-secondary w-full flex items-center justify-center gap-2"
                  >
                    Login to Book
                  </Link>
                )}

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Capacity</span>
                    <span className="font-medium text-navy-900 dark:text-white">{room.capacity} people</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Floor</span>
                    <span className="font-medium text-navy-900 dark:text-white">{room.floor}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Total bookings</span>
                    <span className="font-medium text-navy-900 dark:text-white">{room.bookingCount || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Booking Modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {bookingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBookingOpen(false)}
            />
            <motion.div
              className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-y-auto max-h-[90vh] scrollbar-thin"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-display text-xl font-bold text-navy-900 dark:text-white">Book this Room</h2>
                  <button onClick={() => setBookingOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
                    <HiOutlineX className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleBook} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-navy-900 dark:text-white mb-1">
                      <HiOutlineCalendar className="inline w-4 h-4 mr-1 text-amber-500" />
                      Date
                    </label>
                    <DatePicker
                      selected={bookDate}
                      onChange={d => setBookDate(d)}
                      minDate={new Date()}
                      placeholderText="Select date"
                      dateFormat="MMMM d, yyyy"
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-navy-900 dark:text-white mb-1">
                        <HiOutlineClock className="inline w-4 h-4 mr-1 text-amber-500" />
                        Start Time
                      </label>
                      <select
                        value={startTime}
                        onChange={e => { setStartTime(e.target.value); setEndTime('') }}
                        className="input-field"
                        required
                      >
                        <option value="">Select</option>
                        {TIME_SLOTS.slice(0, -1).map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-900 dark:text-white mb-1">
                        End Time
                      </label>
                      <select
                        value={endTime}
                        onChange={e => setEndTime(e.target.value)}
                        className="input-field"
                        required
                        disabled={!startTime}
                      >
                        <option value="">Select</option>
                        {endTimeOptions.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Total cost */}
                  {startTime && endTime && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3 flex items-center justify-between">
                      <span className="text-sm text-amber-700 dark:text-amber-400 font-medium">Total Cost</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400 text-lg">৳{totalCost()}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-navy-900 dark:text-white mb-1">
                      Special Note (optional)
                    </label>
                    <textarea
                      value={specialNote}
                      onChange={e => setSpecialNote(e.target.value)}
                      className="input-field resize-none"
                      rows={3}
                      placeholder="Any special requirements..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="btn-primary w-full"
                  >
                    {bookingLoading ? 'Processing...' : 'Confirm Booking'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Edit Modal ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {editOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditOpen(false)}
            />
            <motion.div
              className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-y-auto max-h-[90vh] scrollbar-thin"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-display text-xl font-bold text-navy-900 dark:text-white">Edit Room</h2>
                  <button onClick={() => setEditOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
                    <HiOutlineX className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleEditSubmit} className="space-y-4">
                  {[
                    { label: 'Room Name', name: 'name', type: 'text' },
                    { label: 'Image URL', name: 'image', type: 'url' },
                    { label: 'Floor', name: 'floor', type: 'text' },
                  ].map(f => (
                    <div key={f.name}>
                      <label className="block text-sm font-medium text-navy-900 dark:text-white mb-1">{f.label}</label>
                      <input
                        type={f.type}
                        name={f.name}
                        value={editForm[f.name] || ''}
                        onChange={handleEditChange}
                        className="input-field"
                        required
                      />
                    </div>
                  ))}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-navy-900 dark:text-white mb-1">Capacity</label>
                      <input type="number" name="capacity" value={editForm.capacity || ''} onChange={handleEditChange} className="input-field" min={1} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-900 dark:text-white mb-1">Rate (৳/hr)</label>
                      <input type="number" name="hourlyRate" value={editForm.hourlyRate || ''} onChange={handleEditChange} className="input-field" min={1} required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy-900 dark:text-white mb-1">Description</label>
                    <textarea name="description" value={editForm.description || ''} onChange={handleEditChange} rows={3} className="input-field resize-none" required />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy-900 dark:text-white mb-2">Amenities</label>
                    <div className="flex flex-wrap gap-2">
                      {AMENITY_OPTIONS.map(a => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => toggleEditAmenity(a)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                            editForm.amenities?.includes(a)
                              ? 'bg-amber-500 border-amber-500 text-white'
                              : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setEditOpen(false)} className="flex-1 btn-outline">Cancel</button>
                    <button type="submit" disabled={editLoading} className="flex-1 btn-primary">
                      {editLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <ConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Room"
        message={`Are you sure you want to permanently delete "${room.name}"? This action cannot be undone.`}
        confirmLabel="Delete Room"
        danger
      />
    </>
  )
}
