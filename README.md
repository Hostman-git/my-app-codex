# RunMap

RunMap is a full-stack route planner for runners, walkers, and hikers. Users can generate circular, one-way, and out-and-back routes, inspect the route on an OpenStreetMap map, save routes, and track total generated kilometers.

Node.js 24 or newer is required because the backend uses the built-in SQLite driver.

## Stack

- Frontend: React, TypeScript, Vite, React Router, Leaflet
- Backend: Node.js, Express, TypeScript
- Database: SQLite
- Auth: JWT with hashed passwords
- Maps and routing: OpenStreetMap tiles and OpenRouteService

## Project Structure

```text
/frontend
  src/components
  src/pages
  src/services
  src/hooks
/backend
  src/routes
  src/controllers
  src/middleware
  src/services
  src/db
```

## Installation

```bash
npm install --prefix frontend
npm install --prefix backend
npm install
```

Create environment files:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

Set secure values before deploying:

```bash
VITE_ORS_API_KEY=your-openrouteservice-api-key
JWT_SECRET=change-this-long-random-secret
```

## Local Development

Run both apps:

```bash
npm run dev
```

Or run them separately:

```bash
npm run dev --prefix backend
npm run dev --prefix frontend
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`
- Healthcheck: `GET http://localhost:4000/health`

Without an OpenRouteService key, the backend still supports coordinate input such as `40.7128, -74.0060` and returns a deterministic local route geometry. Address search and road-following routes require `VITE_ORS_API_KEY`.

## Environment Variables

Frontend:

```bash
VITE_API_URL=http://localhost:4000
VITE_ORS_API_KEY=
```

Backend:

```bash
PORT=4000
JWT_SECRET=change-this-long-random-secret-before-deploying
DATABASE_PATH=./data/runmap.db
FRONTEND_ORIGIN=http://localhost:5173
VITE_ORS_API_KEY=
```

## API

- `GET /health`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/generate`
- `GET /api/dashboard`
- `GET /api/routes`
- `POST /api/routes`
- `DELETE /api/routes/:id`

## Build and TypeScript

```bash
npm run typecheck
npm run build
```

Frontend build output directory:

```text
frontend/dist
```

Backend start command:

```bash
npm run start --prefix backend
```

## GitHub Setup

```bash
git init
git add .
git commit -m "Initial RunMap application"
git branch -M main
git remote add origin https://github.com/Hostman-git/my-app.git
git push -u origin main
```

## Hostman Deployment Guide

### Frontend Static App

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables:
  - `VITE_API_URL=https://your-backend-domain`
  - `VITE_ORS_API_KEY=your-openrouteservice-api-key`

### Backend Node.js App

- Root directory: `backend`
- Install command: `npm install`
- Build command: `npm run build`
- Start command: `npm run start`
- Healthcheck: `GET /health`
- Environment variables:
  - `PORT=4000`
  - `JWT_SECRET=your-production-secret`
  - `DATABASE_PATH=./data/runmap.db`
  - `FRONTEND_ORIGIN=https://your-frontend-domain`
  - `VITE_ORS_API_KEY=your-openrouteservice-api-key`
- Runtime: Node.js 24+

## Deployment Checklist

- [ ] `frontend/.env` and `backend/.env` are created locally.
- [ ] `JWT_SECRET` is unique and strong in production.
- [ ] `VITE_ORS_API_KEY` is configured for route generation and geocoding.
- [ ] `VITE_API_URL` points to the deployed backend.
- [ ] `FRONTEND_ORIGIN` points to the deployed frontend.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.
- [ ] `GET /health` returns `{ "status": "ok" }`.
- [ ] SQLite database path is writable by the backend app.
- [ ] Hostman backend runtime is set to Node.js 24 or newer.
