# Express API routes

- GET `/api/health`
- GET `/api/studios`
- GET `/api/studios/:id`
- GET `/api/studios/owner/:email`
- POST `/api/studios` (JWT cookie required)
- PATCH `/api/studios/:id` (JWT cookie required)
- DELETE `/api/studios/:id` (JWT cookie required)
- POST `/api/bookings`
- GET `/api/bookings/guest/:email`
- PATCH `/api/bookings/:id/cancel`

For protected studio mutations, the API expects an HTTP-only `studio_token` cookie. The local `/api/auth/session` helper is explicitly development-only; replace it with server-verified Better Auth session validation before production.
