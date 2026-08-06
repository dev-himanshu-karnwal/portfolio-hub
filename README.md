# Portfolio Hub

Internal project / portfolio management app for searching, browsing, and demoing past work during proposals and client screen shares.

**Stack:** React (Vite) · Tailwind CSS · Firebase (Auth, Firestore, Hosting)

**No AI / LLM APIs** — traditional CRUD with client-side filtering only.  
**No Firebase Storage** — text/links only; no thumbnails or media uploads.

## Features

- Email/password and optional email magic-link sign-in (no public signup)
- Roles: `admin`, `editor`, `viewer` (enforced in Security Rules)
- Instant global search + multi-select filters (OR within category, AND across)
- Bookmarkable URL state for search, filters, and view mode
- Grid / table browse + detail panel
- Proposal builder with clipboard / `.txt` / `.md` export
- Add/edit projects (editors/admins)
- Admin user role management

## Prerequisites

- Node.js 20+
- A Firebase project
- Firebase CLI (`npm i -g firebase-tools` or use the local `firebase-tools` devDependency)

## 1. Create a Firebase project

1. Open [Firebase Console](https://console.firebase.google.com/) → Add project.
2. Register a **Web** app and copy the config values.

## 2. Authentication

1. Console → **Authentication** → Get started.
2. Enable **Email/Password**.
3. (Optional) Enable **Email link (passwordless sign-in)** for magic links.
4. Add authorized domains for local (`localhost`) and your hosting domain.
5. **Add users manually** (Authentication → Users → Add user). There is no self-serve signup in the app.

## 3. Firestore

1. Console → **Firestore Database** → Create database (production mode).
2. Deploy rules from this repo (see below).
3. Create the first admin user document:

**Collection:** `users`  
**Document ID:** the user’s Auth UID  

```json
{
  "uid": "<AUTH_UID>",
  "email": "you@company.com",
  "displayName": "Your Name",
  "role": "admin",
  "createdAt": "<set as timestamp in Console>"
}
```

Without this document, sign-in succeeds in Auth but the app signs the user out with “Account not provisioned”.

## 4. Environment variables

```bash
cp .env.example .env
```

Fill in values from Project settings → Your apps:

| Variable | Source |
| --- | --- |
| `VITE_FIREBASE_API_KEY` | apiKey |
| `VITE_FIREBASE_AUTH_DOMAIN` | authDomain |
| `VITE_FIREBASE_PROJECT_ID` | projectId |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | messagingSenderId |
| `VITE_FIREBASE_APP_ID` | appId |

## 5. Security Rules deployment

Update `.firebaserc` with your project ID (already set to `portfolio-hub-dct` if you ran `firebase use`), then:

```bash
npm install
npx firebase login
npx firebase use portfolio-hub-dct
npx firebase deploy --only firestore:rules,firestore:indexes
```

Rules live in:

- `firebase/firestore.rules`
- `firebase/firestore.indexes.json`

See [docs/DATA_MODEL.md](docs/DATA_MODEL.md) for schema, indexes, and permission matrix.

## 6. Local development

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## 7. Deploy to Firebase Hosting

```bash
npm run build
npx firebase deploy --only hosting
```

`firebase.json` serves `dist/` and rewrites all routes to `index.html` for the SPA.

### Deploy everything (rules + hosting)

```bash
npm run build
npx firebase deploy --only firestore:rules,firestore:indexes,hosting
```

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build |
| `npm run deploy` | Build + deploy Hosting |
| `npm run deploy:rules` | Deploy Firestore rules + indexes |

## Inviting teammates

1. Auth → Add user (email/password), or enable magic link and send from the login page after the `users` doc exists.
2. Create `users/{uid}` with `role`: `viewer` | `editor` | `admin` (Console for first admin; afterward use **Admin → Add user profile**).
3. Share credentials / magic-link flow.

## Proposal export rules

- `internal` projects are never exported.
- `proposal_only` requires an explicit confirmation checkbox before export.

## Project structure

```
src/
  components/   # UI, filters, projects, proposal, admin
  contexts/     # Auth, Projects, Proposal
  hooks/        # URL-synced filters
  lib/          # Firebase, filtering, export, API helpers
  pages/        # Login, Home, Admin
  types/        # Shared TypeScript types
firebase/       # Firestore Security Rules + indexes
docs/           # Data model documentation
```
