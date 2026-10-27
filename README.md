# CampusConnect — College Event Management Portal
**Symbiosis Institute of Technology (SIT), Nagpur**  
*B.Tech Full-Stack Web Development Project*

---

## 1. Project Overview

**CampusConnect** is a clean, practical, and functional college event management portal built for **Symbiosis Institute of Technology (SIT), Nagpur**. It provides a single-college platform for technical symposiums, hackathons, workshops, cultural nights, and sports competitions.

The project demonstrates full-stack web development principles:
- **Clean Frontend**: React + Vite + Tailwind CSS with a light, collegiate visual identity.
- **Robust Backend**: Node.js + Express REST API with input validation and role authorization.
- **Relational Database**: PostgreSQL with relational foreign keys, unique constraints, and transaction-locked (`FOR UPDATE`) capacity checks.
- **Official Student Authentication**: Email restriction strictly enforcing SIT Nagpur student batch emails (`firstname.lastname.batchYYYY@sitnagpur.siu.edu`) and mailbox ownership verification before enabling event registration.

---

## 2. Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS v4, React Router DOM, Lucide Icons
- **Backend**: Node.js (ES Modules), Express.js, `cookie-parser`, `cors`, `dotenv`
- **Database**: PostgreSQL 18 with standard `pg` pool
- **Authentication**: `bcryptjs` password hashing, `jsonwebtoken` session cookies, crypto verification tokens
- **Concurrency & Concurrency Locking**: PostgreSQL row-level locks (`SELECT ... FOR UPDATE`) in ACID transactions to prevent seat overbooking and race conditions.

---

## 3. Official College Email Format

The system enforces official student email addresses for Symbiosis Institute of Technology, Nagpur:

$$\text{Format: } \texttt{firstname.lastname.batchYYYY@sitnagpur.siu.edu}$$

### Rules:
- Domain must strictly end with `@sitnagpur.siu.edu`.
- The batch year is a variable 4-digit number (e.g. `batch2021`, `batch2022`, `batch2023`, `batch2024`, `batch2025`).
- Normalization (lowercase, whitespace trimming) and database-level unique indexing prevent duplicate signups.
- Email verification link/token must be consumed before a student can register for any campus event.

---

## 4. User Roles & Seed Demo Accounts

The database comes pre-seeded with realistic SIT Nagpur users and campus events. All seed accounts use password: `Password123!`

| Role | Name | College Email | Password | Primary Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | Aswin Binu | `aswin.binu.batch2024@sitnagpur.siu.edu` | `Password123!` | Browse events, search & filter, register for events, cancel registrations, view student dashboard. |
| **Organizer** | Tanmay Deshmukh (ACM Lead) | `tanmay.deshmukh.batch2023@sitnagpur.siu.edu` | `Password123!` | Submit new events for admin review, edit managed events, view registered student attendee lists. |
| **Administrator**| Prof. Rajesh Sharma (Dean) | `admin.office@sitnagpur.siu.edu` | `Password123!` | Review pending submissions (Approve / Reject), view all users, promote/assign user roles. |

*(Note: On the login screen at `http://localhost:5173/auth`, 1-click demo buttons are provided to instantly autofill these credentials for testing.)*

---

## 5. Project Directory Structure

```
CampusConnect/
├── package.json                   # Workspace root script runner
├── README.md                      # Complete setup & documentation
├── client/                        # Frontend Application (React + Vite)
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js          # REST client wrapper with credentials
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Badge.jsx      # Semantic category, status, and role badges
│   │   │   │   ├── Footer.jsx     # SIT Nagpur collegiate footer
│   │   │   │   └── Navbar.jsx     # Navigation bar with role tabs & user menu
│   │   │   └── events/
│   │   │       ├── EventCard.jsx  # Purpose-built event display card
│   │   │       └── EventFilters.jsx # Search input & category pills
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Session state & role authorization guards
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Page 1: Hero, spotlight event, upcoming cards
│   │   │   ├── ExploreEvents.jsx  # Page 2: Search, category filtering, empty states
│   │   │   ├── EventDetails.jsx   # Page 3: Venue, schedule, capacity, registration
│   │   │   ├── Auth.jsx           # Page 4: Login, register, email verification
│   │   │   ├── StudentDashboard.jsx # Page 5: Registrations table & cancellation
│   │   │   ├── OrganizerDashboard.jsx # Page 6: Event creation, edit & attendee list
│   │   │   └── AdminDashboard.jsx # Page 7: Approval queue & user permissions
│   │   ├── App.jsx                # React Router declarative routes
│   │   ├── index.css              # Clean light collegiate theme tokens
│   │   └── main.jsx
│   ├── vite.config.js             # Vite config with backend proxy on /api
│   └── package.json
│
└── server/                        # Backend REST API (Node.js + Express + pg)
    ├── db/
    │   ├── init.js                # Database init script (runs schema & seeds)
    │   ├── pool.js                # pg client pool connection
    │   ├── schema.sql             # Users, events, registrations DDL
    │   └── seed.sql               # Seed data for SIT Nagpur events & users
    ├── middleware/
    │   └── auth.js                # requireAuth, requireRole, optionalAuth
    ├── controllers/
    │   ├── authController.js      # Register, login, verify, user management
    │   ├── eventController.js     # Events retrieval, creation, review
    │   └── registrationController.js # Transactional registration, cancel, attendees
    ├── routes/
    │   ├── authRoutes.js          # /api/auth/*
    │   ├── eventRoutes.js         # /api/events/*
    │   └── registrationRoutes.js  # /api/registrations/*
    ├── utils/
    │   └── emailValidator.js      # SIT Nagpur student email validation logic
    ├── test/
    │   └── e2e-verification.js    # 28-assertion automated test suite
    ├── server.js                  # Express entry point (port 5000)
    ├── .env                       # Local environment configuration
    ├── .env.example               # Template environment configuration
    └── package.json
```

---

## 6. Setup & Installation Guide

### Prerequisites
1. **Node.js**: v18.0 or higher (Tested on Node `v22.23.2`)
2. **PostgreSQL**: v14.0 or higher (Tested on PostgreSQL 18)

### Step 1: Clone or Navigate to the Workspace
```bash
cd C:\Users\aswin\Downloads\Tanmay
```

### Step 2: Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Step 3: Configure Database & Environment
1. In PostgreSQL, ensure a database named `campusconnect` exists (or create it with `CREATE DATABASE campusconnect;`).
2. Verify `server/.env` contains your PostgreSQL credentials:
   ```env
   PORT=5000
   PGHOST=localhost
   PGPORT=5432
   PGUSER=postgres
   PGPASSWORD=
   PGDATABASE=campusconnect
   JWT_SECRET=sitnagpur_campusconnect_dev_secret_key_2026
   CLIENT_URL=http://localhost:5173
   COLLEGE_EMAIL_DOMAIN=sitnagpur.siu.edu
   ```
3. Initialize the database schema and sample data:
   ```bash
   cd server
   npm run db:init
   ```

### Step 4: Run the Development Servers
Open two terminal windows:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Starts Express API at http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# Starts Vite application at http://localhost:5173
```

---

## 7. Running the Verification Test Suite

An automated end-to-end testing script (`server/test/e2e-verification.js`) tests all 10 core student, organizer, and administrator workflows:

```bash
cd server
node test/e2e-verification.js
```

### Test Coverage Summary:
- **Test 1**: Official SIT Nagpur batch email format validation & rejection of non-college domains.
- **Test 2**: Public events API responding with approved events only.
- **Test 3**: Student account creation with default student role and unverified state.
- **Test 4**: Rejection of event registration by unverified students (HTTP 403).
- **Test 5**: Verification token consumption and mailbox ownership confirmation.
- **Test 6**: Event registration by verified student, decrementing available seats.
- **Test 7**: Prevention of duplicate registrations (HTTP 409).
- **Test 8**: Registration cancellation and immediate seat release in PostgreSQL.
- **Test 9**: Organizer event creation (pending status) and attendee roster viewer.
- **Test 10**: Administrator review queue (approving pending events) and user role administration.

---

## 8. REST API Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register student account with `@sitnagpur.siu.edu` |
| `POST` | `/api/auth/login` | Public | Log in with college email & password |
| `POST` | `/api/auth/logout` | Authenticated | Clear session cookie |
| `GET` | `/api/auth/verify-email?token=` | Public | Verify student email address |
| `GET` | `/api/auth/me` | Authenticated | Get current authenticated user session |
| `GET` | `/api/auth/users` | Admin | List all registered college users |
| `PATCH` | `/api/auth/users/:id/role` | Admin | Update user role (`student`, `organizer`, `admin`) |
| `GET` | `/api/events` | Public | List approved events (search & category filters) |
| `GET` | `/api/events/:id` | Public | Event details + remaining seat count |
| `POST` | `/api/events` | Organizer / Admin | Create new event (starts as `pending` for organizer) |
| `PUT` | `/api/events/:id` | Organizer / Admin | Edit managed event |
| `GET` | `/api/events/organizer/my-events` | Organizer / Admin | List events managed by authenticated organizer |
| `GET` | `/api/events/admin/all` | Admin | List all events (including pending moderation) |
| `PATCH` | `/api/events/:id/review` | Admin | Approve or reject event submission |
| `POST` | `/api/registrations/events/:eventId` | Verified Student | Register for an event (transaction locked) |
| `DELETE` | `/api/registrations/:registrationId` | Student | Cancel registration and release seat |
| `GET` | `/api/registrations/my-registrations` | Student | List authenticated student's registrations |
| `GET` | `/api/registrations/events/:id/attendees` | Organizer / Admin | Get list of registered student attendees |

---

## 9. Academic Notes & Student Explanation

- **Why `pg` instead of an ORM?**: Directly using `pg` with parameterized queries teaches fundamental SQL, prevents SQL injection, and enables exact concurrency control using `SELECT ... FOR UPDATE` inside `BEGIN ... COMMIT` blocks.
- **Why no heavy client state library?**: React's native `useState`, `useEffect`, and `useContext` handle all application state cleanly without unnecessary boilerplate like Redux.
- **Production Email Delivery**: In production, integrate an SMTP provider (Nodemailer, SendGrid, Amazon SES) using the existing `verificationToken` generated in `authController.js`. In the local demonstration interface, a simulated verification button is rendered in the UI for instant testing.
