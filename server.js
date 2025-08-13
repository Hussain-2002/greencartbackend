const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Connect to MongoDB
const seedDatabase = require('./config/seedDatabase');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('MongoDB connected successfully');
  // Seed the database with initial data
  await seedDatabase();
})
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/drivers', require('./routes/drivers'));
app.use('/api/routes', require('./routes/routes'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/simulation', require('./routes/simulation'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
