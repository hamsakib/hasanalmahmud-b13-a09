import { useEffect, useState, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { fetchRooms } from '../utils/api'
import RoomCard from '../components/RoomCard'
import LoadingSpinner from '../components/LoadingSpinner'
import {
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineX,
  HiOutlineAdjustments,
} from 'react-icons/hi'

const AMENITY_OPTIONS = [
  'Whiteboard',
  'Projector',
  'Wi-Fi',
  'Power Outlets',
  'Quiet Zone',
  'Air Conditioning',
]

export default function AllRooms() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedAmenities, setSelectedAmenities] = useState([])
  const [minRate, setMinRate] = useState('')
  const [maxRate, setMaxRate] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(t)
  }, [search])

  const loadRooms = useCallback(() => {
    setLoading(true)
    const params = {}
    if (debouncedSearch) params.search = debouncedSearch
    if (selectedAmenities.length) params.amenities = selectedAmenities.join(',')
    if (minRate) params.minRate = minRate
    if (maxRate) params.maxRate = maxRate

    fetchRooms(params)
      .then(res => setRooms(res.data.rooms || []))
      .catch(() => setRooms([]))
      .finally(() => setLoading(false))
  }, [debouncedSearch, selectedAmenities, minRate, maxRate])

  useEffect(() => {
    loadRooms()
  }, [loadRooms])

  const toggleAmenity = a =>
    setSelectedAmenities(prev =>
      prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
    )

  const clearFilters = () => {
    setSearch('')
    setSelectedAmenities([])
    setMinRate('')
    setMaxRate('')
  }

  const hasFilters = search || selectedAmenities.length || minRate || maxRate

  return (
    <>
      <Helmet>
        <title>StudyNook – Available Rooms</title>
      </Helmet>

      {/* Page header */}
      <section className="bg-navy-950 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="font-display text-4xl font-bold text-white mb-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Browse Study Rooms
          </motion.h1>
          <p className="text-slate-400">
            {rooms.length} room{rooms.length !== 1 ? 's' : ''} available
          </p>
        </div>
      </section>

      <section className="py-10 bg-slate-50 dark:bg-slate-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search + filter bar */}
          <div className="flex flex-col md:flex-row gap-3 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search rooms by name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-10"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <HiOutlineX className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setFilterOpen(v => !v)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border font-medium text-sm transition-colors ${
                filterOpen || hasFilters
                  ? 'bg-amber-500 border-amber-500 text-white'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-amber-400'
              }`}
            >
              <HiOutlineAdjustments className="w-4 h-4" />
              Filters
              {(selectedAmenities.length > 0 || minRate || maxRate) && (
                <span className="bg-white text-amber-600 text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {selectedAmenities.length + (minRate ? 1 : 0) + (maxRate ? 1 : 0)}
                </span>
              )}
            </button>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 px-3"
              >
                <HiOutlineX className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>

          {/* Filter panel */}
          {filterOpen && (
            <motion.div
              className="card p-5 mb-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Amenities */}
                <div>
                  <h4 className="font-semibold text-navy-900 dark:text-white text-sm mb-3 flex items-center gap-2">
                    <HiOutlineFilter className="w-4 h-4 text-amber-500" />
                    Amenities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {AMENITY_OPTIONS.map(a => (
                      <button
                        key={a}
                        onClick={() => toggleAmenity(a)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                          selectedAmenities.includes(a)
                            ? 'bg-amber-500 border-amber-500 text-white'
                            : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-amber-400'
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rate range */}
                <div>
                  <h4 className="font-semibold text-navy-900 dark:text-white text-sm mb-3">
                    Hourly Rate ($/hr)
                  </h4>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minRate}
                      onChange={e => setMinRate(e.target.value)}
                      className="input-field py-2 w-28"
                      min={0}
                    />
                    <span className="text-slate-400">—</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxRate}
                      onChange={e => setMaxRate(e.target.value)}
                      className="input-field py-2 w-28"
                      min={0}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Room grid */}
          {loading ? (
            <LoadingSpinner />
          ) : rooms.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiOutlineSearch className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="font-bold text-lg text-navy-900 dark:text-white mb-2">No rooms found</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                Try adjusting your search or filters.
              </p>
              <button onClick={clearFilters} className="btn-primary">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room, i) => (
                <motion.div
                  key={room._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <RoomCard room={room} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
