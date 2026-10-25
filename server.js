require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    message: '🎬 Welcome to IMovies Backend API!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth (register, login, profile)',
      movies: '/api/movies (list, details, seed)',
      bookings: '/api/bookings (create, user bookings, booked seats)',
    },
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: 'ok',
    database: isDbConnected ? 'connected' : 'disconnected',
    databaseHost: isDbConnected ? mongoose.connection.host : 'offline',
    timestamp: new Date().toISOString(),
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/bookings', bookingRoutes);

// 404 Not Found handler
app.use((req, res, next) => {
  res.status(404).json({ message: `API Route Not Found - ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    message: err.message || 'An unexpected internal server error occurred',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 IMovies Backend Server running on port ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🎬 API Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🍿 Movies API: http://localhost:${PORT}/api/movies`);
  console.log(`===============================================`);
});
