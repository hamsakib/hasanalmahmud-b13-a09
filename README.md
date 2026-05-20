# StudyNook

**Live:** https://hasanalmahmud-b13-a09.vercel.app

Study room booking platform. Users can list their own rooms and others can browse, search, and book them by date and time.

## What it does

- Browse and search study rooms by name, amenities, and hourly rate
- Book a room for a specific date and time — the server rejects overlapping bookings
- List your own rooms, edit details, delete them
- Cancel bookings that haven't passed yet
- Google OAuth and email/password login via Firebase
- Dark/light theme saved in localStorage

## Stack

| | |
|---|---|
| Frontend | React, Vite, Tailwind CSS, Framer Motion |
| Auth | Firebase |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Deploy | Vercel + Render |

## Pages

- `/` — home with featured rooms
- `/rooms` — full room list with filters
- `/rooms/:id` — room detail + booking form
- `/login` / `/register`
- `/add-room` — list a room (auth required)
- `/my-listings` — manage your rooms (auth required)
- `/my-bookings` — view/cancel bookings (auth required)

## Local setup

```bash
# client
npm install
npm run dev

# server
npm install
npm run dev
```

Client `.env`:
```
VITE_API_URL=https://your-server.onrender.com
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```
