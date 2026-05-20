import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import {
  HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff,
  HiOutlineUser, HiOutlinePhotograph, HiOutlineBookOpen, HiOutlineCheckCircle,
} from 'react-icons/hi'
import { FcGoogle } from 'react-icons/fc'

function validatePassword(pw) {
  const errors = []
  if (pw.length < 6) errors.push('At least 6 characters')
  if (!/[A-Z]/.test(pw)) errors.push('At least one uppercase letter')
  if (!/[a-z]/.test(pw)) errors.push('At least one lowercase letter')
  return errors
}

export default function Register() {
  const { registerWithEmail, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', photoURL: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    if (!form.photoURL.trim()) e.photoURL = 'Photo URL is required'
    const pwErrors = validatePassword(form.password)
    if (pwErrors.length) e.password = pwErrors.join(', ')
    return e
  }

  const handleSubmit = async ev => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      await registerWithEmail(form.name, form.email, form.password, form.photoURL)
      toast.success('Registration successful! Please login.')
      navigate('/login')
    } catch (err) {
      const code = err.code || ''
      if (code.includes('email-already-in-use')) {
        setErrors({ email: 'This email is already registered. Try logging in.' })
      } else {
        toast.error('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    try {
      await loginWithGoogle()
      toast.success('Welcome to StudyNook!')
      navigate('/')
    } catch {
      toast.error('Google sign-up failed. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }

  const pwValidation = validatePassword(form.password)

  return (
    <>
      <Helmet>
        <title>StudyNook – Register</title>
      </Helmet>

      <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
        {/* Left panel */}
        <div className="hidden lg:flex flex-col justify-center flex-1 bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-amber-400 rounded-full filter blur-3xl" />
            <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-emerald-400 rounded-full filter blur-3xl" />
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
              Join thousands of<br />focused students.
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed max-w-sm">
              Create an account to book study rooms, or list your own space and start earning.
            </p>

            <div className="mt-12 grid grid-cols-2 gap-4">
              {[
                { value: '2,400+', label: 'Bookings made' },
                { value: '180+', label: 'Active rooms' },
                { value: 'Free', label: 'To register' },
                { value: '24/7', label: 'Available slots' },
              ].map(s => (
                <div key={s.label} className="bg-white/10 rounded-xl p-4">
                  <p className="text-amber-400 font-bold text-xl">{s.value}</p>
                  <p className="text-slate-300 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12 overflow-y-auto">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
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

            <h1 className="font-display text-3xl font-bold text-navy-900 dark:text-white mb-2">Create an account</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Get started for free — no credit card required.</p>

            {/* Google */}
            <button
              onClick={handleGoogle}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-navy-900 dark:text-white font-medium py-3 rounded-xl transition mb-4 disabled:opacity-60"
            >
              <FcGoogle className="w-5 h-5" />
              {googleLoading ? 'Signing up...' : 'Continue with Google'}
            </button>

            <div className="relative flex items-center mb-4">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              <span className="px-3 text-xs text-slate-400">or</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-navy-900 dark:text-white mb-1">Full Name</label>
                <div className="relative">
                  <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.name ? 'border-red-400' : ''}`}
                    placeholder="John Doe"
                    autoComplete="name"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-navy-900 dark:text-white mb-1">Email address</label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.email ? 'border-red-400' : ''}`}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Photo URL */}
              <div>
                <label className="block text-sm font-medium text-navy-900 dark:text-white mb-1">Photo URL</label>
                <div className="relative">
                  <HiOutlinePhotograph className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="url"
                    name="photoURL"
                    value={form.photoURL}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.photoURL ? 'border-red-400' : ''}`}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
                {errors.photoURL && <p className="text-red-500 text-xs mt-1">{errors.photoURL}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-navy-900 dark:text-white mb-1">Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-400' : ''}`}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPass ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength checklist */}
                {form.password && (
                  <div className="mt-2 space-y-1">
                    {[
                      { check: form.password.length >= 6, label: 'At least 6 characters' },
                      { check: /[A-Z]/.test(form.password), label: 'One uppercase letter' },
                      { check: /[a-z]/.test(form.password), label: 'One lowercase letter' },
                    ].map(r => (
                      <div key={r.label} className="flex items-center gap-1.5">
                        <HiOutlineCheckCircle
                          className={`w-3.5 h-3.5 ${r.check ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'}`}
                        />
                        <span className={`text-xs ${r.check ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                          {r.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading || pwValidation.length > 0}
                className="btn-primary w-full py-3"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-amber-500 hover:text-amber-600 font-semibold">
                Login
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  )
}
