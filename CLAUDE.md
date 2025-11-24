# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A gym trainer management application for tracking clients, workouts, and exercises. Built with a React frontend and Express/MongoDB backend.

## Development Commands

### Frontend (React + Vite + TypeScript)
```bash
cd frontend
npm run dev        # Start dev server on http://localhost:5173
npm run build      # Build for production (runs TypeScript compiler + Vite build)
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

### Backend (Express + MongoDB + TypeScript)
```bash
cd backend
npm run dev        # Start dev server with hot reload (tsx watch)
```

Backend runs on port 5000 by default.

## Architecture

### Frontend Structure (Layout > Pages > Components)

**3-tier hierarchy:**
- **DashboardLayout**: Shared layout wrapper containing sidebar navigation and grid structure
- **Pages**: Route-level containers that compose components (in `/src/pages/`)
- **Components**: Reusable UI pieces (in `/src/components/`)

**Routing strategy (Hybrid approach):**
- React Router for top-level navigation (sidebar items):
  - `/` → ClientsPage
  - `/new-client` → AddClientPage
- Local state for data drill-down (client details like edit/workouts):
  - Clicking a client card shows edit/workout views without changing URL
  - Avoids exposing MongoDB ObjectIDs in URLs

**Key patterns:**
- All routes wrapped in `DashboardLayout` which provides persistent sidebar
- Pages import and compose one or more components
- Components manage their own local state but receive data via props

### Backend Structure

**MVC-style organization:**
- `/models` - Mongoose schemas (Client with nested Workout and Exercise schemas)
- `/controllers` - Business logic handlers
- `/routes` - Express route definitions
- `/config` - Database connection

**Data model:**
```
Client
  ├─ firstName, lastName, age, weight, goal, notes
  └─ workouts: []
      ├─ date, notes
      └─ exercises: []
          └─ name, sets, reps, rest
```

### API Communication

Frontend uses Axios instance (`src/services/api.ts`) configured with:
- Base URL from `VITE_API_URL` env variable (defaults to `http://localhost:5000/`)
- Interceptors for auth token handling (currently commented out, ready for future implementation)
- Global error handling

### MongoDB ID Handling

**Important:** Frontend types use `_id` (MongoDB convention), not `id`. All interfaces in `types/clientTypes.tsx` use `_id: string` for Client, Workout, and Exercise entities.

### State Management

- No global state library (Redux, Zustand, etc.)
- Local React state with `useState` for UI state
- Data fetched per-page using API service
- Client detail views (edit/workouts) use local state to avoid URL parameter complexity

## Tech Stack

**Frontend:**
- React 19 + TypeScript
- React Router 7 (routing)
- Tailwind CSS 4 (styling)
- Axios (HTTP client)
- Vite (build tool)

**Backend:**
- Express 5
- MongoDB + Mongoose
- TypeScript (compiled with tsx)
- CORS enabled
- JWT + bcrypt (authentication setup present but not fully implemented)

## Environment Configuration

Backend expects `.env` file with MongoDB connection string (dotenv is configured but no specific variables documented yet).

Frontend uses `VITE_API_URL` for API base URL configuration.

## Code Conventions

- Hebrew text used in UI (RTL support may be needed)
- TypeScript interfaces defined in `/frontend/src/types/`
- Components use function declarations (not arrow functions for exports)
- Consistent naming: Pages end with "Page", Forms end with "Form", Lists end with "List"
