import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import MainLayout from './layouts/MainLayout'
import PrivateRoute from './components/PrivateRoute'

import Home from './pages/Home'
import AllRooms from './pages/AllRooms'
import RoomDetails from './pages/RoomDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import AddRoom from './pages/AddRoom'
import MyListings from './pages/MyListings'
import MyBookings from './pages/MyBookings'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/rooms" element={<AllRooms />} />
              <Route path="/rooms/:id" element={<RoomDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Private routes */}
              <Route path="/add-room" element={<PrivateRoute><AddRoom /></PrivateRoute>} />
              <Route path="/my-listings" element={<PrivateRoute><MyListings /></PrivateRoute>} />
              <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>

          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3500,
              style: {
                background: 'var(--toast-bg, #fff)',
                color: 'var(--toast-color, #1e3a5f)',
                borderRadius: '12px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: '500',
                padding: '12px 16px',
              },
              success: {
                iconTheme: { primary: '#10b981', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#fff' },
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
