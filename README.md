# BookEasy — Online Booking System

A full-stack appointment booking system built with Node.js/Express and React.

```
Customer's phone or PC
        │
        ▼
  ┌─────────────┐
  │   Website   │  Booking form + service pages  (React + Vite)
  └──────┬──────┘
         │
         ▼
  ┌──────────────┐
  │ Backend API  │  Express + MongoDB              (:5000)
  └──────┬───────┘
    ┌────┼────────────────┐
    ▼    ▼                ▼
Database  Admin Dashboard  Notifications
(MongoDB) (React /admin)   (Email + WhatsApp)
```

---

## Features

| Area | Details |
|---|---|
| **Public website** | Home, Services, 4-step booking wizard, Confirmation page, Booking lookup + cancel |
| **Admin dashboard** | Login, Dashboard stats, Bookings (filter/search/status), Customers, Services CRUD, Settings |
| **Notifications** | HTML email (Nodemailer/SMTP) + WhatsApp (Twilio) on confirm, cancel, and daily reminders |
| **Auth** | JWT-based admin auth, role support (`admin` / `superadmin`) |
| **Slot logic** | Business hours config, slot intervals, max concurrent bookings per slot |

---

## Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))
- A Gmail/SMTP account for email
- A [Twilio](https://twilio.com) account with WhatsApp Sandbox enabled

---

## Quick Start

### 1. Install dependencies

```bash
cd booking-system
npm run install:all
```

### 2. Configure the backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and fill in all values (see table below).

### 3. Seed the database

Creates the superadmin account and sample services.

```bash
npm run seed
```

Default credentials:
- **Email:** `admin@bookings.com`
- **Password:** `Admin1234!`

> Change the password immediately after first login.

### 4. Start the servers

Open **two terminals**:

```bash
# Terminal 1 — backend
cd booking-system/backend
npm run dev
```

```bash
# Terminal 2 — frontend
cd booking-system/frontend
npm run dev
```

| URL | What it is |
|---|---|
| `http://localhost:5173` | Customer-facing website |
| `http://localhost:5173/admin` | Admin dashboard |
| `http://localhost:5000/api` | Backend API |
| `http://localhost:5000/health` | Health check |

---

## Environment Variables

### `backend/.env`

| Variable | Description |
|---|---|
| `PORT` | Backend port (default `5000`) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string for signing JWTs |
| `JWT_EXPIRES_IN` | Token expiry e.g. `7d` |
| `BUSINESS_NAME` | Your business name (used in emails/WhatsApp) |
| `FRONTEND_URL` | Frontend URL for email links |
| `SMTP_HOST` | SMTP server (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | SMTP port (`587` for TLS, `465` for SSL) |
| `SMTP_SECURE` | `true` for port 465, `false` for 587 |
| `SMTP_USER` | SMTP username / email address |
| `SMTP_PASS` | SMTP password or App Password |
| `SMTP_FROM` | Sender address shown to customers |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token |
| `TWILIO_WHATSAPP_FROM` | Twilio WhatsApp number e.g. `+14155238886` |

---

## API Reference

### Public

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/services` | List active services |
| `GET` | `/api/bookings/slots?serviceId=&date=` | Available time slots |
| `POST` | `/api/bookings` | Create a booking |
| `GET` | `/api/bookings/:idOrCode` | Get booking by ID or confirmation code |
| `PATCH` | `/api/bookings/:id/cancel` | Cancel a booking |

### Admin (requires `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Admin login |
| `GET` | `/api/auth/me` | Current admin |
| `PUT` | `/api/auth/change-password` | Change password |
| `GET` | `/api/admin/stats` | Dashboard stats |
| `POST` | `/api/admin/create-admin` | Create admin (superadmin only) |
| `POST` | `/api/admin/run-reminders` | Manually trigger reminder job |
| `GET` | `/api/bookings` | All bookings (paginated, filterable) |
| `PATCH` | `/api/bookings/:id/status` | Update booking status |
| `GET` | `/api/customers` | All customers |
| `GET` | `/api/customers/:id` | Customer + their bookings |
| `PUT` | `/api/customers/:id` | Update customer |
| `POST` | `/api/services` | Create service |
| `PUT` | `/api/services/:id` | Update service |
| `DELETE` | `/api/services/:id` | Deactivate service |

---

## Project Structure

```
booking-system/
├── backend/
│   └── src/
│       ├── app.js               # Express app setup
│       ├── server.js            # Entry point
│       ├── controllers/         # Route handlers
│       ├── middleware/          # auth, errorHandler, validate
│       ├── models/              # Mongoose models
│       ├── routes/              # Express routers
│       ├── services/            # Email, WhatsApp, reminder job
│       └── utils/               # db, nanoid, seed, slots
└── frontend/
    └── src/
        ├── App.jsx              # Route definitions
        ├── api/                 # Axios API layer
        ├── components/          # Layout, ServiceCard, Icons
        ├── pages/               # Public pages
        └── admin/
            ├── api/             # Admin API calls
            ├── components/      # AdminLayout, RequireAuth
            ├── context/         # AuthContext
            └── pages/           # Dashboard, Bookings, Customers…
```

---

## Setting Up WhatsApp (Twilio Sandbox)

1. Sign up at [twilio.com](https://twilio.com).
2. Go to **Messaging → Try it out → Send a WhatsApp message**.
3. Follow the sandbox join instructions (customer sends a code to the sandbox number).
4. Copy your Account SID, Auth Token, and sandbox number into `.env`.

For production, apply for a [WhatsApp Business API](https://www.twilio.com/whatsapp) number.

---

## Setting Up Gmail SMTP

1. Enable 2-Step Verification on your Google account.
2. Go to **Google Account → Security → App passwords**.
3. Generate a password for "Mail" and use it as `SMTP_PASS`.
4. Set `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_SECURE=false`.

---

## Customising Business Hours

Business hours are stored in MongoDB as a `BusinessHours` document.
The default schedule (Mon–Sat, 9 AM–5 PM, 30-min slots) is seeded automatically.

To change them, update the document directly in MongoDB or add an admin UI route.
