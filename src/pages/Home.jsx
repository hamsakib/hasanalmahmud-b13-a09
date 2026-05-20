import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { fetchRooms } from '../utils/api'
import RoomCard from '../components/RoomCard'
import LoadingSpinner from '../components/LoadingSpinner'
import {
  HiOutlineSearch,
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineStar,
  HiOutlineCheckCircle,
  HiOutlineArrowRight,
} from 'react-icons/hi'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
}

const testimonials = [
  {
    name: 'Aria Thompson',
    role: 'Graduate Student, MIT',
    text: 'StudyNook has completely transformed how I prepare for exams. I can book a quiet, distraction-free room in under a minute.',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
  },
  {
    name: 'James Okafor',
    role: 'Undergraduate, Columbia',
    text: 'As someone who works best with complete quiet, the Quiet Zone filter is a game-changer. Highly recommend for any serious student.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
  },
  {
    name: 'Priya Nair',
    role: 'Law Student, Yale',
    text: "I listed my department's study room on StudyNook and it gets fully booked every week. Great passive income for our student org.",
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    rating: 5,
  },
]

const howItWorks = [
  {
    step: '01',
    title: 'Search & Filter',
    description: 'Browse available rooms by amenities, capacity, or hourly rate to find your perfect study spot.',
    icon: <HiOutlineSearch className="w-6 h-6" />,
    color: 'bg-amber-500',
  },
  {
    step: '02',
    title: 'Book Instantly',
    description: 'Choose your date and time slot. Our system prevents double-bookings automatically.',
    icon: <HiOutlineClock className="w-6 h-6" />,
    color: 'bg-emerald-500',
  },
  {
    step: '03',
    title: 'Study & Succeed',
    description: 'Show up, settle in, and focus. Your room is reserved and waiting for you.',
    icon: <HiOutlineCheckCircle className="w-6 h-6" />,
    color: 'bg-blue-500',
  },
]

const stats = [
  { value: '2,400+', label: 'Study Sessions Booked' },
  { value: '180+', label: 'Rooms Available' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '45+', label: 'Partner Libraries' },
]

export default function Home() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRooms({ limit: 6, sort: 'newest' })
      .then(res => setRooms(res.data.rooms || []))
      .catch(() => setRooms([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Helmet>
        <title>StudyNook – Home</title>
      </Helmet>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-gradient-hero overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-400 rounded-full filter blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <span className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-amber-500/30">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                Rooms available now
              </span>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                Find Your{' '}
                <span className="text-amber-400 relative">
                  Perfect
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                    <path d="M2 8 C50 2, 150 2, 198 8" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" fill="none" />
                  </svg>
                </span>{' '}
                Study Room
              </h1>

              <p className="text-slate-300 text-lg sm:text-xl leading-relaxed mb-8 max-w-lg">
                Browse and book quiet, private study rooms in your library. List your own room and earn. No more distractions — just focus.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/rooms" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3">
                  Explore Rooms
                  <HiOutlineArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/add-room" className="btn-outline inline-flex items-center gap-2 text-base px-8 py-3 border-white text-white hover:bg-white hover:text-navy-900">
                  List a Room
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-4 mt-10">
                <HiOutlineShieldCheck className="w-5 h-5 text-amber-400" />
                <span className="text-slate-400 text-sm">Verified rooms • Instant booking • No double-booking</span>
              </div>
            </motion.div>

            {/* Hero image / stats card */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="hidden lg:block"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=700&q=80"
                  alt="Library study room"
                  className="rounded-3xl shadow-2xl w-full object-cover h-[480px]"
                />
                {/* Floating card */}
                <motion.div
                  className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-xl"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <p className="text-xs text-slate-500 mb-1">Next Available</p>
                  <p className="font-bold text-navy-900 dark:text-white text-sm">Room 3B — Today 2:00 PM</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span className="text-xs text-emerald-600 font-medium">Available now</span>
                  </div>
                </motion.div>
                <motion.div
                  className="absolute -top-6 -right-6 bg-amber-500 rounded-2xl p-4 shadow-xl text-white"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                >
                  <p className="text-2xl font-bold">180+</p>
                  <p className="text-xs text-amber-100">Rooms listed</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60H1440V20C1200 50 960 0 720 20C480 40 240 0 0 20V60Z" className="fill-slate-50 dark:fill-slate-900" />
          </svg>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────────── */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <p className="font-display text-4xl font-bold text-amber-500 mb-1">{stat.value}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Available Rooms ─────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="section-title">Latest Study Rooms</h2>
            <p className="section-subtitle">
              Hand-picked rooms added recently — book before they fill up.
            </p>
          </motion.div>

          {loading ? (
            <LoadingSpinner />
          ) : rooms.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-400 text-lg">No rooms available yet. Be the first to add one!</p>
              <Link to="/add-room" className="btn-primary mt-4 inline-block">List a Room</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room, i) => (
                <motion.div
                  key={room._id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                >
                  <RoomCard room={room} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/rooms" className="btn-outline">
              View All Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-14"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="section-title">How StudyNook Works</h2>
            <p className="section-subtitle">Book a room in three simple steps</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-amber-500/30 via-emerald-500/30 to-blue-500/30" />

            {howItWorks.map((item, i) => (
              <motion.div
                key={item.step}
                className="relative text-center"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-5 text-white shadow-lg`}>
                  {item.icon}
                </div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Step {item.step}
                </span>
                <h3 className="font-display text-xl font-bold text-navy-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-14"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
              What Students Say
            </h2>
            <p className="text-slate-400 text-lg">Real feedback from our community</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="bg-navy-900 border border-navy-800 rounded-2xl p-6"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                whileHover={{ y: -4 }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <HiOutlineStar key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-amber-500/30"
                  />
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-amber-500 to-amber-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full filter blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <motion.h2
            className="font-display text-4xl md:text-5xl font-bold text-white mb-4"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Ready to Find Your Focus?
          </motion.h2>
          <motion.p
            className="text-amber-100 text-lg mb-8"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
          >
            Join thousands of students who've already discovered their perfect study room.
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
          >
            <Link
              to="/rooms"
              className="bg-white text-amber-600 hover:bg-amber-50 font-bold px-10 py-3.5 rounded-xl transition-all duration-200 hover:shadow-xl inline-flex items-center gap-2"
            >
              Start Exploring
              <HiOutlineArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
