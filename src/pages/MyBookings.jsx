import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { fetchMyBookings, cancelBooking } from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ConfirmModal from '../components/ConfirmModal'
import {
  HiOutlineBookOpen,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineX,
  HiOutlineCheckCircle,
  HiOutlineCollection,
} from 'react-icons/hi'

function StatusBadge({ status }) {
  if (status === 'confirmed') {
    return (
      <span className="badge-green">
        <HiOutlineCheckCircle className="w-3 h-3" />
        Confirmed
      </span>
    )
  }
  return (
    <span className="badge-red">
      <HiOutlineX className="w-3 h-3" />
      Cancelled
    </span>
  )
}

function isCancellable(booking) {
  if (booking.status !== 'confirmed') return false
  const bookingDate = new Date(booking.date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return bookingDate >= today
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelId, setCancelId] = useState(null)

  useEffect(() => {
    fetchMyBookings()
      .then(res => setBookings(res.data.bookings || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }, [])

  const handleCancel = async () => {
    try {
      await cancelBooking(cancelId)
      setBookings(bs =>
        bs.map(b => b._id === cancelId ? { ...b, status: 'cancelled' } : b)
      )
      toast.success('Booking cancelled')
    } catch {
      toast.error('Failed to cancel booking')
    } finally {
      setCancelId(null)
    }
  }

  const formatDate = d => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <>
      <Helmet>
        <title>StudyNook – My Bookings</title>
      </Helmet>

      <div className="pt-24 pb-16 min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="section-title flex items-center gap-2">
              <HiOutlineBookOpen className="text-amber-500" />
              My Bookings
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Track and manage all your study room reservations.
            </p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : bookings.length === 0 ? (
            <div className="card p-16 text-center">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiOutlineCollection className="w-9 h-9 text-slate-400" />
              </div>
              <h3 className="font-display text-xl font-bold text-navy-900 dark:text-white mb-2">
                No bookings yet
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                Find a study room and book your first session!
              </p>
              <Link to="/rooms" className="btn-primary inline-flex">Browse Rooms</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Total Bookings', value: bookings.length, color: 'text-navy-900 dark:text-white' },
                  { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, color: 'text-emerald-600' },
                  { label: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length, color: 'text-red-500' },
                ].map(s => (
                  <div key={s.label} className="card p-4 text-center">
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {bookings.map((booking, i) => (
                <motion.div
                  key={booking._id}
                  className="card p-0 overflow-hidden"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Room image */}
                    <div className="w-full sm:w-40 h-28 sm:h-auto flex-shrink-0 overflow-hidden">
                      <img
                        src={booking.room?.image || 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400'}
                        alt={booking.room?.name}
                        className="w-full h-full object-cover"
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400' }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-display text-base font-bold text-navy-900 dark:text-white truncate">
                              {booking.room?.name || 'Unknown Room'}
                            </h3>
                            <StatusBadge status={booking.status} />
                          </div>

                          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 mt-3">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                              <HiOutlineCalendar className="text-amber-500 w-3.5 h-3.5 flex-shrink-0" />
                              {formatDate(booking.date)}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                              <HiOutlineClock className="text-amber-500 w-3.5 h-3.5 flex-shrink-0" />
                              {booking.startTime} – {booking.endTime}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                              <HiOutlineCurrencyDollar className="w-3.5 h-3.5 flex-shrink-0" />
                              ${booking.totalCost} total
                            </div>
                          </div>

                          {booking.specialNote && (
                            <p className="mt-2 text-xs text-slate-500 dark:text-slate-500 italic">
                              Note: {booking.specialNote}
                            </p>
                          )}
                        </div>

                        {/* Cancel button */}
                        {isCancellable(booking) && (
                          <button
                            onClick={() => setCancelId(booking._id)}
                            className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition flex-shrink-0"
                          >
                            <HiOutlineX className="w-4 h-4" />
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!cancelId}
        onClose={() => setCancelId(null)}
        onConfirm={handleCancel}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmLabel="Cancel Booking"
        danger
      />
    </>
  )
}
