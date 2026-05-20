import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import toast from 'react-hot-toast'
import {
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineChevronDown,
  HiOutlineLogout,
  HiOutlineBookOpen,
  HiOutlineHome,
  HiOutlinePlusCircle,
  HiOutlineCollection,
} from 'react-icons/hi'

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors duration-200 px-1 py-0.5 relative ${
    isActive
      ? 'text-amber-500'
      : 'text-slate-200 hover:text-white dark:text-slate-300 dark:hover:text-white'
  }`

export default function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handler = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
      navigate('/')
      setDropdownOpen(false)
    } catch {
      toast.error('Failed to log out')
    }
  }

  const closeMobile = () => setMobileOpen(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-navy-950 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            onClick={closeMobile}
          >
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <HiOutlineBookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-white">
              Study<span className="text-amber-400">Nook</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to="/rooms" className={navLinkClass}>Rooms</NavLink>
            {user && (
              <>
                <NavLink to="/add-room" className={navLinkClass}>Add Room</NavLink>
                <NavLink to="/my-listings" className={navLinkClass}>My Listings</NavLink>
                <NavLink to="/my-bookings" className={navLinkClass}>My Bookings</NavLink>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg bg-navy-800 hover:bg-navy-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <HiOutlineSun className="w-4 h-4" /> : <HiOutlineMoon className="w-4 h-4" />}
            </button>

            {user ? (
              /* Profile dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(v => !v)}
                  className="flex items-center gap-2 bg-navy-800 hover:bg-navy-700 rounded-xl px-3 py-1.5 transition-colors"
                >
                  <img
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=d97706&color=fff`}
                    alt={user.displayName}
                    className="w-7 h-7 rounded-full object-cover"
                    onError={e => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=d97706&color=fff`
                    }}
                  />
                  <span className="text-sm text-white font-medium max-w-[120px] truncate">
                    {user.displayName?.split(' ')[0]}
                  </span>
                  <HiOutlineChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-sm font-semibold text-navy-900 dark:text-white truncate">
                          {user.displayName}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/my-listings"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <HiOutlineCollection className="w-4 h-4" />
                          My Listings
                        </Link>
                        <Link
                          to="/my-bookings"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <HiOutlineBookOpen className="w-4 h-4" />
                          My Bookings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <HiOutlineLogout className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary py-2 text-sm">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg bg-navy-800 flex items-center justify-center text-slate-300"
            >
              {theme === 'dark' ? <HiOutlineSun className="w-4 h-4" /> : <HiOutlineMoon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="w-9 h-9 rounded-lg bg-navy-800 flex items-center justify-center text-slate-300"
            >
              {mobileOpen ? <HiOutlineX className="w-5 h-5" /> : <HiOutlineMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="md:hidden bg-navy-900 border-t border-navy-800"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 py-4 space-y-1">
              {user && (
                <div className="flex items-center gap-3 pb-3 mb-3 border-b border-navy-800">
                  <img
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=d97706&color=fff`}
                    alt={user.displayName}
                    className="w-9 h-9 rounded-full object-cover"
                    onError={e => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=d97706&color=fff`
                    }}
                  />
                  <div>
                    <p className="text-white font-medium text-sm">{user.displayName}</p>
                    <p className="text-slate-400 text-xs truncate">{user.email}</p>
                  </div>
                </div>
              )}

              {[
                { to: '/', icon: <HiOutlineHome />, label: 'Home' },
                { to: '/rooms', icon: <HiOutlineCollection />, label: 'Rooms' },
                ...(user ? [
                  { to: '/add-room', icon: <HiOutlinePlusCircle />, label: 'Add Room' },
                  { to: '/my-listings', icon: <HiOutlineCollection />, label: 'My Listings' },
                  { to: '/my-bookings', icon: <HiOutlineBookOpen />, label: 'My Bookings' },
                ] : []),
              ].map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                    }`
                  }
                >
                  <span className="text-base">{link.icon}</span>
                  {link.label}
                </NavLink>
              ))}

              {user ? (
                <button
                  onClick={() => { handleLogout(); closeMobile() }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/20 mt-2"
                >
                  <HiOutlineLogout className="text-base" />
                  Logout
                </button>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link to="/login" onClick={closeMobile} className="flex-1 text-center btn-outline py-2 text-sm">
                    Login
                  </Link>
                  <Link to="/register" onClick={closeMobile} className="flex-1 text-center btn-primary py-2 text-sm">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
