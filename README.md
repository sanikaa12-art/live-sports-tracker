# Scoreboard — Live Sports Tracker

A real-time sports tracking application: live match scores, upcoming fixtures, match-center detail pages, search, and a favorites system, updated over WebSockets without polling.

Built as a portfolio project by **Sanika Shendkar** — Electronics & Telecommunication Engineering, PVG's College of Engineering, Pune.

---

## Why this stack

## Why this stack

The architecture deliberately uses a practical real-time web development stack to demonstrate hands-on implementation across the frontend and backend:

* **React + Node/Express + Socket.IO** — used to build the application's real-time sports updates and interactive user experience.

* **Async/await throughout the backend**, with a centralized error-handling approach for cleaner and more maintainable server-side code.

* **A swappable data-provider layer** (`mockDataProvider` / `liveApiProvider` behind one `dataProvider.js` seam) — keeps the application flexible and makes it easier to integrate a live sports API.

* **MongoDB-shaped service boundaries** (`favoritesService.js`) — keeps storage logic separate from the application routes, allowing the data layer to be replaced or extended later.

## Features

- **Live matches** across football, cricket, basketball, and tennis, each rendered from one sport-agnostic `MatchCard`/`ScoreDisplay` pair driven by pure formatting functions (`utils/matchDisplay.js`) — adding a fifth sport means adding data and a `case`, not new components.
- **Real-time score updates** pushed over Socket.IO and merged into React state in place — no polling, no full-page refresh, timers cleaned up on unmount.
- **Upcoming & completed matches**, filterable by sport, with live countdowns.
- **Match-center detail pages** with sport-specific stats: possession/shots/cards for football, overs/run-rate/batsmen for cricket, quarter scores/fouls for basketball, sets/aces for tennis.
- **Search** across teams, players, and tournaments, debounced client-side.
- **Favorites**: star any team, see only their matches on a dedicated page. Persisted server-side against an anonymous client id (see [Auth note](#auth-note)).
- **Light/dark mode**, persisted, respecting `prefers-color-scheme` on first load.
- **Loading, empty, and error states everywhere** — no request ever leaves the user staring at a blank screen.

## Architecture

```
Frontend (React)                Backend (Express)
──────────────────              ──────────────────
components/  → dumb UI          routes/     → HTTP boundary, validation
pages/       → screens          services/   → business logic (testable, no Express)
context/     → theme/toast/favs services/dataProvider.js → mock ⇄ live switch
services/    → api.js, socket.js sockets/    → Socket.IO live-score push
hooks/       → useMatches, etc. data/       → seed data
utils/       → pure formatters  middleware/ → async error handling
```

The frontend never talks to the data provider directly — everything goes through `services/api.js` (REST) and `services/socket.js` (live push). The backend never lets a route touch `mockDataProvider` or `liveApiProvider` directly — everything goes through `services/dataProvider.js`, chosen by one environment variable:

```
Frontend → api.js / socket.js → Express routes → matchService.js → dataProvider.js → mock provider
                                                                                    ↘ live provider (real API)
```

Swapping `DATA_PROVIDER=mock` → `DATA_PROVIDER=live` in `backend/.env` and filling in `liveApiProvider.js` is the only change needed to go from simulated data to a real sports API — nothing in routes, services, or the frontend changes.

### Auth note

There's no login yet. Favorites are scoped to a random client id generated once and stored in `localStorage` (`frontend/src/services/clientId.js`), sent as an `X-Client-Id` header. `backend/src/services/favoritesService.js` is written against that same id, so swapping in real authentication later means replacing the in-memory `Map` with a database lookup keyed by user id — no route or frontend change required.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router, Vite |
| Real-time client | socket.io-client |
| Backend | Node.js, Express |
| Real-time server | Socket.IO |
| Testing | Jest + Supertest (backend), Vitest + Testing Library (frontend) |
| Styling | Plain CSS with design-token custom properties (no framework) |

## API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/matches?status=&sport=` | List matches, optionally filtered |
| GET | `/api/matches/:id` | Single match detail |
| GET | `/api/sports` | Supported sports |
| GET | `/api/search?q=` | Search teams/tournaments |
| GET | `/api/favorites` | List favorite team ids (needs `X-Client-Id`) |
| POST | `/api/favorites` | Add a favorite `{ teamId }` |
| DELETE | `/api/favorites/:teamId` | Remove a favorite |

Socket.IO event: `matches:update` — pushed every 4s with any matches whose state changed since the last tick.

## Running locally

**Requirements:** Node.js 18+

```bash
# 1. Backend
cd backend
cp .env.example .env
npm install
npm run dev          # http://localhost:4000

# 2. Frontend (new terminal)
cd frontend
cp .env.example .env
npm install
npm run dev           # http://localhost:5173
```

Open `http://localhost:5173`. Live matches update automatically every few seconds — no setup needed, the mock provider runs out of the box.

### Environment variables

**backend/.env**
```
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
DATA_PROVIDER=mock          # or "live" once liveApiProvider.js is configured
LIVE_SPORTS_API_BASE_URL=   # only needed for DATA_PROVIDER=live
LIVE_SPORTS_API_KEY=
```

**frontend/.env**
```
VITE_API_URL=http://localhost:4000
```

## Testing

```bash
cd backend && npm test    # 19 tests: service-layer unit tests + route integration tests
cd frontend && npm test   # 15 tests: sport-formatting utils, debounce hook, filter component
```

## Building for production

```bash
cd frontend && npm run build     # outputs frontend/dist
cd backend  && npm start         # runs the API as-is (no build step needed)
```

## Deployment

1. **Backend** — deploy `backend/` to any Node host (Render, Railway, Fly.io). Set `PORT`, `CLIENT_ORIGIN` (your deployed frontend URL), and `DATA_PROVIDER`.
2. **Frontend** — run `npm run build` in `frontend/` and deploy the `dist/` folder to any static host (Vercel, Netlify, Cloudflare Pages). Set `VITE_API_URL` to your deployed backend URL at build time.
3. Update `CLIENT_ORIGIN` on the backend to match the deployed frontend's origin so CORS and Socket.IO both allow it.

## Future improvements

- Real authentication (JWT or session-based) replacing the anonymous client id
- MongoDB/Firebase persistence for favorites and match history
- A genuine live-sports API behind `liveApiProvider.js`
- Push notifications for favorited teams' matches going live
- Pagination on completed matches as history grows

