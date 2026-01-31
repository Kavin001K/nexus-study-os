# Nexus Study OS

A premium, AI-powered collaborative study platform for JEE, NEET, and UPSC aspirants.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Shadcn UI, Three.js (R3F)
- **Backend**: Express.js, TypeScript
- **Database**: SQLite (better-sqlite3)
- **State Management**: Zustand

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   This will run both the frontend (8080) and backend (3001) concurrently.
   ```bash
   npm run dev
   ```

3. **Open App**
   Visit [http://localhost:8080](http://localhost:8080)

## Features implemented

- **Full Stack Architecture**: Express backend with SQLite database
- **Authentication**: Session-based auth with mock Google Sign-In
- **Dashboard**: Glassmorphic dashboard with real-time stats
- **3D Knowledge Graph**: Interactive 3D visualization of study topics
- **Goal Rooms**: Collaborative study spaces
- **Activity Feed**: Real-time tracking of user activities

## Project Structure

- `src/` - Frontend React application
  - `components/` - UI components
  - `pages/` - Route pages (Landing, Dashboard)
  - `store/` - Zustand state management
  - `lib/api.ts` - API client
- `server/` - Backend Express application
  - `db/` - Database schema and setup
  - `routes/` - API routes
  - `services/` - Business logic
