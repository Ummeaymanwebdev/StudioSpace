# StudioSpace 🎬

StudioSpace is a full-stack studio booking platform where users can explore creative spaces, view studio details, and book studios for their photography, filmmaking, podcasting, and other creative projects.

## 🌐 Live Demo

- Live Website:  http://localhost:3000
- Server API:    http://localhost:5000
- GitHub Repository: https://github.com/Ummeaymanwebdev/StudioSpace

## ✨ Features

- **User Authentication:** Register and log in securely using Better Auth.
- **Social Login:** Google authentication.
- **Explore Studios:** Browse available studios with details.
- **Search & Filter:** Find studios by category and search terms.
- **Studio Details:** View studio information, images, gallery, pricing, and host details.
- **Add Studio:** Logged-in users can publish their own studio listings.
- **Manage Listings:** Update and delete owned studio listings.
- **Image Upload:** Upload studio images using ImgBB.
- **Booking System:** Book studios by selecting a date and time.
- **Booking Validation:** Prevent invalid dates, times, and overlapping confirmed bookings.
- **My Bookings:** View personal booking history.
- **Cancel Booking:** Cancel pending bookings.
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices.
- **Loading States:** Skeleton loaders for better user experience.
- **Error Handling:** API error responses and validation messages.

## 🛠️ Technologies Used

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Better Auth
- React Hot Toast
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- MongoDB Node.js Driver
- JWT
- Cookie Parser
- CORS

### Tools & Services
- Git & GitHub
- ImgBB
- Vercel

## 📁 Project Structure

```text
StudioSpace/
│
├── studiospace-client/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── studiospace-server/
│   ├── middleware/
│   │   └── requireAuth.js
│   ├── scripts/
│   ├── db.js
│   ├── index.js
│   ├── package.json
│   └── ...
│
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Ummeaymanwebdev/StudioSpace.git
cd StudioSpace
```

### 2. Setup Frontend

```bash
cd studiospace-client
npm install
```

Create a `.env.local` file in the `studiospace-client` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
BETTER_AUTH_SECRET=ad4c2e7fd22c29f2010c39edb23dce20bb2dd2a3e2477a30b1a01eefdb83062e
BETTER_AUTH_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at:

`http://localhost:3000`

### 3. Setup Backend

Open another terminal:

```bash
cd studiospace-server
npm install
```

Create a `.env` file in the `studiospace-server` directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://umme12ayman_db_user:afiyan.12.ummeayman@cluster0.nsv2my8.mongodb.net/
JWT_SECRET=ad4c2e7fd22c29f2010c39edb23dce20bb2dd2a3e2477a30b1a01eefdb83062e

CLIENT_URL=http://localhost:3000
```

Start the backend:

```bash
npm run dev
```

Backend runs at:

`http://localhost:5000`

## 🔐 Environment Variables

Never commit your `.env` or `.env.local` files. Keep your database credentials, authentication secrets, and API keys private.

Use the example environment files as a reference when available.

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check server status |
| GET | `/api/studios` | Get all studios |
| GET | `/api/studios/:id` | Get studio details |
| GET | `/api/studios/owner/:email` | Get owner's studios |
| POST | `/api/studios` | Create a studio |
| PATCH | `/api/studios/:id` | Update a studio |
| DELETE | `/api/studios/:id` | Delete a studio |
| POST | `/api/bookings` | Create a booking |
| GET | `/api/bookings/guest/:email` | Get user bookings |
| PATCH | `/api/bookings/:id/cancel` | Cancel a pending booking |

**Note:** Protected endpoints require a valid authenticated session.

## 🗄️ Database

StudioSpace uses MongoDB to store studio listings and booking information.

Main collections:
- `studios`
- `bookings`
- Better Auth-managed authentication collections

## 🚀 Deployment

- Frontend: Vercel
- Backend: Deploy to a Node.js hosting platform.
- Database: MongoDB Atlas

Make sure to configure the production environment variables and CORS origin before deployment.

## 👩‍💻 Author

**Umme Ayman**

- GitHub: [@Ummeaymanwebdev](https://github.com/Ummeaymanwebdev)

---

⭐ If you find this project useful, feel free to explore the repository and share your feedback.

