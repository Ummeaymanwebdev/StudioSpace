# StudioSpace — Green & Light Lemon Edition

A full-stack starter for the B14-A8 StudioSpace assignment.

## Folder structure

- `studiospace-client/` — Next.js App Router frontend, TypeScript, Tailwind CSS
- `studiospace-server/` — Express API, MongoDB, JWT-protected mutations
- `docs/` — setup notes and requirement checklist

## Requirements covered in this starter

- Responsive light-lemon / green UI
- Home page with hero, featured studios, categories, booking steps, host guarantee
- Explore studios with search and category filter
- Studio details, gallery, amenities, reviews, host information
- Add, update, delete studio listings
- Booking creation, my bookings, cancellation, confirmed/pending status display
- Register/login UI, Google/GitHub Better Auth provider configuration
- Toast notifications, skeleton loading, empty states, custom 404
- Express API with MongoDB collections `studios` and `bookings`
- JWT HTTP-only cookie middleware for protected API mutations
- Booking overlap check for confirmed bookings
- Theme toggle
- Optional wishlist and invoice are described in `docs/OPTIONAL.md`

> Important: this is a complete project scaffold with working page/API structure, but you must add your own MongoDB Atlas URI, Better Auth OAuth credentials, and run the setup/build checks locally. OAuth provider credentials and deployment settings cannot be prefilled. Test every route before submission.

## 1. Requirements

- Node.js 20+
- MongoDB Atlas database
- Google OAuth credentials
- GitHub OAuth credentials (optional if you keep GitHub social login enabled)

## 2. Configure the backend

Open `studiospace-server`:

```bash
npm install
```

Copy `.env.example` to `.env` and fill in your values:

```env
PORT=5000
MONGODB_URI=mongodb+srv://DB_USER:DB_PASSWORD@YOUR_CLUSTER.mongodb.net/studiospace?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_long_random_secret_at_least_32_chars
CLIENT_URL=http://localhost:3000
```

Start API:

```bash
npm run dev
```

Seed sample studios:

```bash
npm run seed
```

The seed script inserts 12 sample studio listings. Run `npm run seed:reset` to remove and reinsert demo listings.

## 3. Configure the frontend

Open `studiospace-client`:

```bash
npm install
```

Copy `.env.example` to `.env.local` and set:

```env
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_long_random_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

Run:

```bash
npm run dev
```

Frontend: `http://localhost:3000`

## 4. Authentication and API security

Better Auth is configured in `lib/auth.ts` with MongoDB and Google/GitHub providers. The Express API also contains an HTTP-only JWT cookie guard for protected mutations.

For a production submission, connect your Better Auth session to the backend JWT issuance flow before enabling protected API mutations. Do not trust user identity values submitted directly from the browser. The API's `POST /api/auth/session` endpoint signs a short-lived token and is intended for local integration only; replace it with verified Better Auth session validation before deployment.

## 5. Useful routes

| Route | Purpose |
|---|---|
| `/` | Home |
| `/studios` | Explore and filter studios |
| `/studios/[id]` | Studio details |
| `/add-studio` | Add listing (login required) |
| `/my-listings` | Owner listings |
| `/studios/edit/[id]` | Edit listing |
| `/my-bookings` | Reservations |
| `/login` | Login |
| `/register` | Register |

## 6. GitHub commits

The assignment asks for at least 15 notable client commits and 8 server commits. Make meaningful commits as you complete each feature; do not create fake or empty commits.

Suggested sequence:
1. Initialize client and server
2. Add global theme and navbar
3. Build responsive hero
4. Add featured studios and categories
5. Add explore filters
6. Add studio details
7. Add Better Auth setup
8. Add register/login forms
9. Add backend MongoDB connection
10. Add studios API
11. Add add/edit/delete listing
12. Add booking API
13. Add my bookings and cancellation
14. Add loading/empty/error states
15. Add responsive refinements and README
