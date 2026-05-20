import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { fetchMyRooms, deleteRoom } from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ConfirmModal from '../components/ConfirmModal'
import {
  HiOutlinePlusCircle,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineCollection,
  HiOutlineUsers,
  HiOutlineCurrencyDollar,
  HiOutlineBookmark,
} from 'react-icons/hi'

export default function MyListings() {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    fetchMyRooms()
      .then(res => setRooms(res.data.rooms || []))
      .catch(() => setRooms([]))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async () => {
    try {
      await deleteRoom(deleteId)
      setRooms(r => r.filter(x => x._id !== deleteId))
      toast.success('Room deleted successfully')
    } catch {
      toast.error('Failed to delete room')
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <>
      <Helmet>
        <title>StudyNook – My Listings</title>
      </Helmet>

      <div className="pt-24 pb-16 min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="section-title flex items-center gap-2">
                <HiOutlineCollection className="text-amber-500" />
                My Listings
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Manage the study rooms you've listed on StudyNook.
              </p>
            </div>
            <Link to="/add-room" className="btn-primary flex items-center gap-2 w-fit">
              <HiOutlinePlusCircle className="w-4 h-4" />
              Add New Room
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : rooms.length === 0 ? (
            <div className="card p-16 text-center">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiOutlineCollection className="w-9 h-9 text-slate-400" />
              </div>
              <h3 className="font-display text-xl font-bold text-navy-900 dark:text-white mb-2">
                No rooms listed yet
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                Share your space with students and earn!
              </p>
              <Link to="/add-room" className="btn-primary inline-flex items-center gap-2">
                <HiOutlinePlusCircle className="w-4 h-4" />
                List Your First Room
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {rooms.map((room, i) => (
                <motion.div
                  key={room._id}
                  className="card p-0 overflow-hidden"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="w-full sm:w-44 h-36 sm:h-auto flex-shrink-0 overflow-hidden">
                      <img
                        src={room.image || 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400'}
                        alt={room.name}
                        className="w-full h-full object-cover"
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400' }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-lg font-bold text-navy-900 dark:text-white mb-1 truncate">
                          {room.name}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-3">
                          {room.description}
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <HiOutlineUsers className="text-amber-500 w-3.5 h-3.5" />
                            {room.capacity} people
                          </span>
                          <span className="flex items-center gap-1">
                            <HiOutlineCurrencyDollar className="text-amber-500 w-3.5 h-3.5" />
                            ${room.hourlyRate}/hr
                          </span>
                          <span className="flex items-center gap-1">
                            <HiOutlineBookmark className="text-amber-500 w-3.5 h-3.5" />
                            {room.bookingCount || 0} bookings
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex sm:flex-col gap-2 sm:w-36">
                        <Link
                          to={`/rooms/${room._id}`}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium py-2 px-3 rounded-lg transition"
                        >
                          <HiOutlineEye className="w-4 h-4" />
                          View
                        </Link>
                        <Link
                          to={`/rooms/${room._id}`}
                          state={{ openEdit: true }}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-sm font-medium py-2 px-3 rounded-lg transition"
                        >
                          <HiOutlinePencil className="w-4 h-4" />
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteId(room._id)}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 text-sm font-medium py-2 px-3 rounded-lg transition"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                          Delete
                        </button>
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
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Room"
        message="Are you sure you want to delete this room? All associated bookings will be affected."
        confirmLabel="Delete Room"
        danger
      />
    </>
  )
}
