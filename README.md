# 🎬 IMovies - Full Stack MERN Movie Ticket Booking Website

Welcome to **IMovies**, a full-stack cinema ticket booking application built with MongoDB, Express.js, React.js, and Node.js (MERN stack).

---

## 🌟 Features Included

1. **User Authentication**: Secure user registration and login using JWT (JSON Web Tokens) and bcrypt password hashing.
2. **Movie Catalog**: Real-time display of blockbuster movies with posters, genres, ratings, durations, and descriptions.
3. **Showtimes & Theaters**: Interactive selection of dates, theaters (IMAX, 4DX, VIP), and show timings.
4. **Interactive Seat Selection Grid**: Visual cinema hall layout with rows (A-F) and columns, real-time seat availability, booked seat locks, and dynamic price calculations.
5. **Instant Ticket Booking**: Seamless booking transaction creating unique ticket reference codes.
6. **Digital Ticket Confirmation**: Pass view complete with QR reference, show details, seat numbers, and a 1-click print/save feature.
7. **My Bookings Dashboard**: Personal history of all past and upcoming booked cinema tickets.
8. **Modern Cinema Dark UI**: High-fidelity, responsive design with smooth animations.

---

## 📁 Project Architecture & Structure

```
imovies/
├── backend/                  # Server-side (Node.js & Express.js)
│   ├── config/
│   │   └── db.js             # MongoDB connection setup
│   ├── controllers/
│   │   ├── authController.js    # Register, Login, Profile logic
│   │   ├── movieController.js   # Fetch movies, seed catalog logic
│   │   └── bookingController.js # Seat booking & ticket history logic
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT authorization token verification
│   ├── models/
│   │   ├── User.js           # User schema (email, encrypted password)
│   │   ├── Movie.js          # Movie schema (poster, timings, price)
│   │   └── Booking.js        # Booking schema (user, movie, seats, ref code)
│   ├── routes/
│   │   ├── authRoutes.js     # /api/auth
│   │   ├── movieRoutes.js    # /api/movies
│   │   └── bookingRoutes.js  # /api/bookings
│   ├── seed/
│   │   └── seedData.js       # Script to load initial movies into MongoDB
│   ├── .env                  # Environment variables
│   ├── package.json          # Backend dependencies
│   └── server.js             # Express entry point
│
├── frontend/                 # Client-side (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Header navigation with user status
│   │   │   ├── Footer.jsx       # Cinema branding footer
│   │   │   └── MovieCard.jsx    # Movie poster card with rating pill
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # User session & token management
│   │   ├── pages/
│   │   │   ├── HomePage.jsx          # Catalog, search, genre filter
│   │   │   ├── MovieDetailsPage.jsx  # Synopsis, dates, theater & timings
│   │   │   ├── BookingPage.jsx       # Visual seat picker & checkout
│   │   │   ├── ConfirmationPage.jsx  # Digital ticket & pass
│   │   │   ├── LoginPage.jsx         # Sign in
│   │   │   ├── RegisterPage.jsx      # Sign up
│   │   │   └── MyBookingsPage.jsx    # User tickets list
│   │   ├── services/
│   │   │   └── api.js           # Centralized API fetch helper
│   │   ├── App.jsx              # Main routing configuration
│   │   ├── index.css            # Custom cinema theme styling
│   │   └── main.jsx             # React entry point
│   ├── index.html               # HTML wrapper with Google Fonts
│   ├── package.json             # Frontend dependencies
│   └── vite.config.js           # Vite server configuration
│
└── package.json              # Convenient root scripts
```

---

## 🚀 How to Run the Project Locally

### Step 1: Open a Terminal in the Backend Folder
```bash
cd backend
npm install
npm run dev
```
The backend server will run at: **`http://localhost:5000`**

*(Note: If you have MongoDB installed locally or a free MongoDB Atlas connection string, update `backend/.env` with your `MONGODB_URI`)*.

---

### Step 2: Open a Second Terminal in the Frontend Folder
```bash
cd frontend
npm install
npm run dev
```
The frontend website will open at: **`http://localhost:3000`**

---

### Step 3: Populate Movies (Optional)
If your MongoDB database is empty, the server automatically loads sample blockbuster movies. You can also manually seed the database anytime by running:
```bash
cd backend
npm run seed
```
Or simply click the **"Populate Default Movies"** button in the web browser!
