import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { HiOutlineArrowLeft, HiOutlineHome } from 'react-icons/hi'

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>StudyNook – Page Not Found</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Illustration */}
          <div className="relative mx-auto mb-8 w-48 h-48">
            <div className="absolute inset-0 bg-amber-500/10 rounded-full" />
            <div className="absolute inset-6 bg-amber-500/20 rounded-full flex items-center justify-center">
              <span className="font-display text-6xl font-bold text-amber-500">404</span>
            </div>
          </div>

          <h1 className="font-display text-4xl font-bold text-navy-900 dark:text-white mb-3">
            Page Not Found
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-8">
            The page you're looking for has been moved, deleted, or never existed. Let's get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.history.back()}
              className="btn-outline inline-flex items-center justify-center gap-2"
            >
              <HiOutlineArrowLeft className="w-4 h-4" />
              Go Back
            </button>
            <Link to="/" className="btn-primary inline-flex items-center justify-center gap-2">
              <HiOutlineHome className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  )
}
