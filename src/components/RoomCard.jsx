import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiOutlineUsers,
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlineCheckCircle,
} from 'react-icons/hi'

export default function RoomCard({ room }) {
  const { _id, name, description, image, floor, capacity, hourlyRate, amenities = [] } = room

  const visibleAmenities = amenities.slice(0, 3)
  const extraCount = amenities.length - visibleAmenities.length

  const truncatedDesc = description?.length > 100
    ? description.slice(0, 100) + '...'
    : description

  return (
    <motion.div
      className="card flex flex-col h-full group"
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <img
          src={image || 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600'}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={e => {
            e.target.src = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600'
          }}
        />
        <div className="absolute top-3 right-3">
          <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
            ৳{hourlyRate}/hr
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-display text-lg font-bold text-navy-900 dark:text-white mb-1 line-clamp-1">
          {name}
        </h3>

        <p className="text-slate-500 dark:text-slate-400 text-sm mb-3 line-clamp-2 flex-1">
          {truncatedDesc}
        </p>

        {/* Meta info */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-3 text-xs text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <HiOutlineLocationMarker className="text-amber-500 w-4 h-4" />
            {floor}
          </span>
          <span className="flex items-center gap-1">
            <HiOutlineUsers className="text-amber-500 w-4 h-4" />
            Up to {capacity} people
          </span>
          <span className="flex items-center gap-1">
            <HiOutlineCurrencyDollar className="text-amber-500 w-4 h-4" />
            ৳{hourlyRate}/hr
          </span>
        </div>

        {/* Amenity chips */}
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {visibleAmenities.map(a => (
              <span
                key={a}
                className="inline-flex items-center gap-0.5 text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full"
              >
                <HiOutlineCheckCircle className="text-emerald-500 w-3 h-3" />
                {a}
              </span>
            ))}
            {extraCount > 0 && (
              <span className="text-xs px-2 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full">
                +{extraCount} more
              </span>
            )}
          </div>
        )}

        <Link
          to={`/rooms/${_id}`}
          className="btn-primary text-center text-sm py-2 mt-auto"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  )
}
