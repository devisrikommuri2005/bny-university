# BNY University — Onboarding & Training Portal (First Draft)

A React (Vite) front end for the BNY University onboarding portal: login,
a fresher/experienced dashboard, a Training section, a Programs section,
and an Admin panel to manage portal content.

## Run it locally

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

## Demo logins

This first draft uses mock, in-memory accounts (see `src/data/mockData.js`) —
there's no real backend yet.

| Role | Email | Password |
|---|---|---|
| Fresher | `ananya.rao@bny.com` | `Welcome@123` |
| Experienced | `karthik.s@bny.com` | `Welcome@123` |
| Admin | `priya.menon@bny.com` | `Admin@123` |

Tick **"Use multi-factor verification"** on the login screen to see the MFA
step — any 6-digit code is accepted in this draft.

## What's in here

- **Login** (`src/pages/Login.jsx`) — a "Portal Login" tab (freshers &
  experienced hires share one login) and a separate "Admin Login" tab.
  Invalid credentials show an inline error dialog on the same page (never a
  browser alert). Includes Forgot Password and optional MFA modals.
- **Dashboard** (`src/pages/Dashboard.jsx`) — Point of Contact and Time
  Tracker Sheet for everyone; Onboarding Steps and Mandatory Trainings show
  only for freshers.
- **Training** (`src/pages/Training.jsx`) — Introduction to Account, Domain
  Specific Training, Functional Training (with recorded sessions), and
  Interview Questions / FAQs.
- **Programs** (`src/pages/Programs.jsx`) — Elevate and Forge.
- **Admin** (`src/pages/Admin.jsx`, admin-only route) — edit/add/remove POCs,
  manage mandatory trainings, attach recorded sessions to a technology,
  add interview questions & FAQs, and edit program details.

## Data & persistence (draft-only)

`src/data/mockData.js` seeds everything. Whatever the Admin edits is written
to `localStorage` (`bny_portal_state`) so changes survive a page refresh
during review. There's no real database yet — when you're ready to wire up
a backend:

1. Replace `src/context/AuthContext.jsx`'s `login()` with a real API call
   (and move password checks server-side — never ship plaintext passwords
   like the seed data does).
2. Replace the `loadState`/`saveState` functions in `mockData.js` with API
   calls, and swap the `usePortalData()` mutations in
   `PortalDataContext.jsx` for real requests.
3. Swap the training/session links (currently placeholder URLs under
   `training.bny.example` / `recordings.bny.example`) for your real links —
   you mentioned you'll be sending these over.

## Design notes

Pastel "campus" palette (periwinkle blue, sage green, dusty rose, soft gold
on a cream base) — tokens live in `src/styles/tokens.css`. Fraunces for
headings, Sora for body text, IBM Plex Mono for data/labels. The onboarding
steps use a dotted "learning path" connector as the page's signature visual
motif.

## Next steps to discuss

- Real backend/auth (this draft has no server — do not use the seed
  passwords anywhere real)
- Real mandatory-training and recorded-session links
- Whether "experienced" hires need any onboarding-adjacent content beyond
  the Time Tracker
- Role-based field-level permissions on the Admin panel if needed later
