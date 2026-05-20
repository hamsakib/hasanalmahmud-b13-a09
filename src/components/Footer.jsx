import { Link } from 'react-router-dom'
import {
  HiOutlineBookOpen,
  HiOutlineMail,
  HiOutlinePhone,
} from 'react-icons/hi'
import { FaFacebookF, FaLinkedinIn, FaInstagram } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-navy-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                <HiOutlineBookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-white">
                Study<span className="text-amber-400">Nook</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Your go-to platform for booking quiet, productive study rooms in libraries and academic spaces near you.
            </p>
            {/* Social */}
            <div className="flex gap-3 mt-5">
              {[
                { icon: <FaFacebookF />, href: '#', label: 'Facebook' },
                { icon: <FaXTwitter />, href: '#', label: 'X (Twitter)' },
                { icon: <FaLinkedinIn />, href: '#', label: 'LinkedIn' },
                { icon: <FaInstagram />, href: '#', label: 'Instagram' },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 bg-navy-800 hover:bg-amber-500 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors text-sm"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/rooms', label: 'Browse Rooms' },
                { to: '/add-room', label: 'List a Room' },
                { to: '/my-bookings', label: 'My Bookings' },
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm text-slate-400">
                <HiOutlineMail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                support@studynook.io
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-400">
                <HiOutlinePhone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                +880 1712-345678
              </li>
            </ul>
            <div className="mt-5 p-3 bg-navy-800/50 rounded-lg">
              <p className="text-xs text-slate-400">
                Available Mon – Fri, 9 AM – 6 PM EST
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-navy-800 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-500">
            © {year} StudyNook. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Built for students, by students.
          </p>
        </div>
      </div>
    </footer>
  )
}
