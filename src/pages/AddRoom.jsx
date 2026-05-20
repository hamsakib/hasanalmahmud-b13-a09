import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { createRoom } from '../utils/api'
import {
  HiOutlinePlusCircle,
  HiOutlinePhotograph,
  HiOutlineLocationMarker,
  HiOutlineUsers,
  HiOutlineCurrencyDollar,
  HiOutlineCheckCircle,
} from 'react-icons/hi'

const AMENITY_OPTIONS = [
  'Whiteboard', 'Projector', 'Wi-Fi', 'Power Outlets', 'Quiet Zone', 'Air Conditioning',
]

export default function AddRoom() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    image: '',
    floor: '',
    capacity: '',
    hourlyRate: '',
    amenities: [],
  })
  const [errors, setErrors] = useState({})

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }))
  }

  const toggleAmenity = a => {
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter(x => x !== a)
        : [...f.amenities, a],
    }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Room name is required'
    if (!form.description.trim()) e.description = 'Description is required'
    if (!form.image.trim()) e.image = 'Image URL is required'
    if (!form.floor.trim()) e.floor = 'Floor is required'
    if (!form.capacity || form.capacity < 1) e.capacity = 'Capacity must be at least 1'
    if (!form.hourlyRate || form.hourlyRate < 1) e.hourlyRate = 'Rate must be at least ৳1'
    return e
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await createRoom({
        ...form,
        capacity: Number(form.capacity),
        hourlyRate: Number(form.hourlyRate),
      })
      toast.success('Room added successfully!')
      navigate('/my-listings')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add room. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>StudyNook – Add Room</title>
      </Helmet>

      <div className="pt-24 pb-16 min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center mb-10">
              <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <HiOutlinePlusCircle className="w-8 h-8 text-amber-500" />
              </div>
              <h1 className="section-title">List a Study Room</h1>
              <p className="section-subtitle mt-2">
                Share your space with fellow students and start earning.
              </p>
            </div>

            <div className="card p-8">
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                {/* Room Name */}
                <div>
                  <label className="block text-sm font-medium text-navy-900 dark:text-white mb-1">
                    Room Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={`input-field ${errors.name ? 'border-red-400' : ''}`}
                    placeholder="e.g., The Quiet Corner"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-navy-900 dark:text-white mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    className={`input-field resize-none ${errors.description ? 'border-red-400' : ''}`}
                    placeholder="Describe your room — layout, atmosphere, rules..."
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-navy-900 dark:text-white mb-1">
                    <HiOutlinePhotograph className="inline w-4 h-4 mr-1 text-amber-500" />
                    Image URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    className={`input-field ${errors.image ? 'border-red-400' : ''}`}
                    placeholder="https://example.com/room.jpg"
                  />
                  {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                  {form.image && (
                    <div className="mt-2 h-32 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
                      <img
                        src={form.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={e => { e.target.style.display = 'none' }}
                      />
                    </div>
                  )}
                </div>

                {/* Floor, Capacity, Rate */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-navy-900 dark:text-white mb-1">
                      <HiOutlineLocationMarker className="inline w-4 h-4 mr-1 text-amber-500" />
                      Floor <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="floor"
                      value={form.floor}
                      onChange={handleChange}
                      className={`input-field ${errors.floor ? 'border-red-400' : ''}`}
                      placeholder="e.g., 3rd Floor"
                    />
                    {errors.floor && <p className="text-red-500 text-xs mt-1">{errors.floor}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy-900 dark:text-white mb-1">
                      <HiOutlineUsers className="inline w-4 h-4 mr-1 text-amber-500" />
                      Capacity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={form.capacity}
                      onChange={handleChange}
                      min={1}
                      className={`input-field ${errors.capacity ? 'border-red-400' : ''}`}
                      placeholder="e.g., 4"
                    />
                    {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy-900 dark:text-white mb-1">
                      <HiOutlineCurrencyDollar className="inline w-4 h-4 mr-1 text-amber-500" />
                      Rate (৳/hr) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="hourlyRate"
                      value={form.hourlyRate}
                      onChange={handleChange}
                      min={1}
                      className={`input-field ${errors.hourlyRate ? 'border-red-400' : ''}`}
                      placeholder="e.g., 5"
                    />
                    {errors.hourlyRate && <p className="text-red-500 text-xs mt-1">{errors.hourlyRate}</p>}
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-medium text-navy-900 dark:text-white mb-3">
                    <HiOutlineCheckCircle className="inline w-4 h-4 mr-1 text-amber-500" />
                    Amenities
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {AMENITY_OPTIONS.map(a => (
                      <label
                        key={a}
                        className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                          form.amenities.includes(a)
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                            : 'border-slate-200 dark:border-slate-600 hover:border-amber-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={form.amenities.includes(a)}
                          onChange={() => toggleAmenity(a)}
                          className="accent-amber-500 w-4 h-4"
                        />
                        <span className={`text-sm font-medium ${form.amenities.includes(a) ? 'text-amber-700 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>
                          {a}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex-1 btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 btn-primary"
                  >
                    {loading ? 'Adding Room...' : 'Add Room'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
