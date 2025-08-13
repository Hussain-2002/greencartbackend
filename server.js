const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
// CORS Configuration
app.use((req, res, next) => {
  const allowedOrigins = ['https://greencartlogistic.netlify.app', 'http://localhost:3000'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Parse JSON bodies
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

// Routes with /api prefix
app.use('/api/auth', require('./routes/auth'));
app.use('/api/drivers', require('./routes/drivers'));
app.use('/api/routes', require('./routes/routes'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/simulation', require('./routes/simulation'));

// Alternative routes without /api prefix (for backward compatibility)
app.use('/auth', require('./routes/auth'));
app.use('/drivers', require('./routes/drivers'));
app.use('/routes', require('./routes/routes'));
app.use('/orders', require('./routes/orders'));
app.use('/simulation', require('./routes/simulation'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});