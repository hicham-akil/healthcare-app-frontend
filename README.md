# Healthcare App Frontend

React frontend for the healthcare platform. It provides patient appointment booking, doctor queue management, clinic dashboards, admin dashboards, subscriptions, authentication, profiles, and real-time queue status.

## Stack

- React 19
- Vite 7
- React Router 7
- Tailwind CSS 4
- Radix UI primitives and local UI components
- Lucide React icons
- Vitest, Testing Library, and jsdom
- Nginx for the production Docker image

## Project Structure

```text
src
|-- components/
|   |-- Admin/        # Admin dashboard
|   |-- Apointement/  # Appointment booking, history, queue actions
|   |-- Auth/         # Sign in, sign up, password reset
|   |-- Clinique/     # Clinic dashboard
|   |-- Profile/      # Profile display and updates
|   |-- Security/     # Protected route guard
|   |-- reusable/     # Shared layout components
|   |-- schedule/     # Doctor working hours
|   `-- ui/           # Small reusable UI primitives
|-- context/          # Auth context
|-- hooks/            # API and WebSocket hooks
|-- Pages/            # Routed pages
|-- tests/            # Vitest tests
`-- utils/            # API helpers and domain utilities
```

## Main Routes

- `/` - home page
- `/auth` - sign in and sign up
- `/offres` - subscription offers
- `/forgot-password` and `/reset-password` - password recovery
- `/profile` and `/edit-profile` - authenticated user profile
- `/ShowMed`, `/Takeapointement/:id`, `/confirm-appointment/:idHoraire` - patient appointment flow
- `/myapoin` and `/history` - appointment queue and history
- `/workinghours` - doctor schedule management
- `/admin` - admin dashboard
- `/clinique` - clinic dashboard

Protected routes are enforced in `src/components/Security/ProtectedRoute.jsx`.

## Environment Variables

Vite reads frontend variables at build time. Create `healthcare-app-frontend/.env.local` for local development:

```env
VITE_API_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080
```

When running through the Docker/Nginx setup, `VITE_API_URL` may be empty so REST calls use relative `/api/...` paths. Keep `VITE_WS_URL` absolute for browser WebSocket connections:

```env
VITE_API_URL=
VITE_WS_URL=ws://localhost
```

The production Nginx config proxies `/api/` and `/ws/` to the backend container.

## Local Development

Install dependencies:

```bash
npm ci
```

Start the Vite dev server:

```bash
npm run dev
```

The app runs on the Vite URL printed in the terminal, usually `http://localhost:5173`.

Run the backend separately on `http://localhost:8080` so API and WebSocket calls work.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run test
npm run test:watch
npm run test:coverage
```

## Testing

Run all frontend tests:

```bash
npm run test
```

Run coverage:

```bash
npm run test:coverage
```

Coverage thresholds are configured in `vite.config.js`.

## Production Build

Build the static app:

```bash
npm run build
```

Preview the built app:

```bash
npm run preview
```

The generated files are written to `dist/`.

## Docker

Build the frontend image from this folder:

```bash
docker build -f frontend.Dockerfile -t healthcare-app-frontend .
```

For local Docker Compose deployment, run from the repository root:

```bash
docker compose up --build frontend
```

The Docker image builds the Vite app with Node 20, then serves `dist/` from Nginx on port `80`.

## API Client Notes

- `src/utils/api.js` reads `VITE_API_URL`.
- `src/utils/apiFetch.js` centralizes authenticated fetch calls and error handling.
- `src/hooks/useFetch.js` wraps common loading/error/refetch behavior.
- `src/hooks/useQueueSocket.js` connects to `${VITE_WS_URL}/ws/queue?patientId=...&medecinId=...`.

Keep `VITE_API_URL` and `VITE_WS_URL` aligned with the backend origin in local development. In Docker Compose, `VITE_API_URL` can stay empty for Nginx-proxied REST calls, while `VITE_WS_URL` should point to the frontend/Nginx origin, such as `ws://localhost` locally or `wss://your-domain.com` in production.
