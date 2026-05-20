import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiOutlineBookOpen } from 'react-icons/hi'
import { FcGoogle } from 'react-icons/fc'

export default function Login() {
  const { loginWithEmail, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await loginWithEmail(email, password)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (err) {
      const code = err.code || ''
      if (code.includes('user-not-found') || code.includes('wrong-password') || code.includes('invalid-credential')) {
        setError('Invalid email or password. Please try again.')
      } else if (code.includes('too-many-requests')) {
        setError('Too many failed attempts. Please try again later.')
      } else {
        setError('Login failed. Please check your credentials.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    try {
      await loginWithGoogle()
      toast.success('Welcome!')
      navigate(from, { replace: true })
    } catch {
      toast.error('Google sign-in failed. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>StudyNook – Login</title>
      </Helmet>

      <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
        {/* Left decorative panel */}
        <div className="hidden lg:flex flex-col justify-center flex-1 bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-400 rounded-full filter blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400 rounded-full filter blur-3xl" />
          </div>
          <div className="relative z-10 px-16 py-12">
            <Link to="/" className="flex items-center gap-2 mb-12">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                <HiOutlineBookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="font-display text-2xl font-bold text-white">
                Study<span className="text-amber-400">Nook</span>
              </span>
            </Link>
            <h2 className="font-display text-4xl font-bold text-white mb-4 leading-tight">
              Your perfect study<br />space awaits.
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed max-w-sm">
              Log in to browse and book quiet study rooms near you. Focus better, study smarter.
            </p>

            <div className="mt-12 space-y-4">
              {['No double-bookings, ever', 'Instant booking confirmation', 'Cancel anytime before your session'].map(f => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-amber-500/30 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-amber-400 rounded-full" />
                  </div>
                  <span className="text-slate-300 text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Mobile logo */}
            <div className="lg:hidden flex justify-center mb-8">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center">
                  <HiOutlineBookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="font-display text-xl font-bold text-navy-900 dark:text-white">
                  Study<span className="text-amber-500">Nook</span>
                </span>
              </Link>
            </div>

            <h1 className="font-display text-3xl font-bold text-navy-900 dark:text-white mb-2">Welcome back</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Sign in to your account to continue.</p>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg px-4 py-3 text-sm mb-5">
                {error}
              </div>
            )}

            {/* Google */}
            <button
              onClick={handleGoogle}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-navy-900 dark:text-white font-medium py-3 rounded-xl transition mb-4 disabled:opacity-60"
            >
              <FcGoogle className="w-5 h-5" />
              {googleLoading ? 'Signing in...' : 'Continue with Google'}
            </button>

            <div className="relative flex items-center mb-4">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              <span className="px-3 text-xs text-slate-400">or</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-900 dark:text-white mb-1">Email address</label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-900 dark:text-white mb-1">Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input-field pl-10 pr-10"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPass ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-amber-500 hover:text-amber-600 font-semibold">
                Register
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  )
}
