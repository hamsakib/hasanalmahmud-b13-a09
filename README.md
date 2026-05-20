# StudyNook 📚

> **Live Site:** https://hasanalmahmud-b13-a09.vercel.app

A full-stack study room booking platform where students and library users can list private study rooms and other registered users can browse, search, filter, and book them for specific date and time slots.

---

## Features

- **Smart Booking System** – Select a date, start time, and end time with automatic total cost calculation. The server detects and prevents double-bookings using overlapping time-slot validation.
- **JWT Authentication with HTTP-Only Cookies** – Secure login via email/password or Google OAuth. Tokens are stored in HTTP-only cookies, never in localStorage, protecting against XSS attacks.
- **Room Management (Full CRUD)** – Authenticated users can list new study rooms, update details, or delete their own listings. Ownership is enforced server-side on every mutation.
- **Search & Filter** – Find rooms instantly by name (regex search), amenities (Wi-Fi, Projector, Quiet Zone, etc.), and hourly rate range — all powered by MongoDB operators.
- **Dark / Light Theme Toggle** – A one-click theme switcher in the navbar persists the user's preference across sessions using `localStorage` and Tailwind's `dark` class strategy.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Routing | React Router DOM v6 |
| Auth | Firebase (Google OAuth + Email/Password) |
| HTTP | Axios with credentials |
| Notifications | React Hot Toast |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth Tokens | JWT stored in HTTP-only cookies |
| Deployment | Vercel (client) · Render (server) |

---

## Pages

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Hero, featured rooms, how-it-works, testimonials |
| `/rooms` | Public | All rooms with search & filter |
| `/rooms/:id` | Public | Full room details, booking form (private) |
| `/login` | Public | Email/Password + Google login |
| `/register` | Public | Registration with password strength check |
| `/add-room` | Private | List a new study room |
| `/my-listings` | Private | Manage your listed rooms |
| `/my-bookings` | Private | View and cancel your bookings |

---

## Environment Variables

Create a `.env` file in the client root:

```env
VITE_API_URL=https://your-server.onrender.com
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

---

## Running Locally

```bash
# Client
cd client
npm install
npm run dev

# Server
cd server
npm install
npm run dev
```

---

*Built with care for students everywhere.*
