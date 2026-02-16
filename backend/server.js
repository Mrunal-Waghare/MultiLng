require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const otpRoutes = require('./routes/otpRoutes');
const authRoutes = require('./routes/authRoutes.js'); 

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());


// ================= AUTH ROUTES =================
// This handles:
// POST /api/auth/signup
// POST /api/auth/login
app.use('/api/auth', authRoutes); 


// ================= OTP ROUTES =================
app.use('/api/otp', otpRoutes);


// ================= SERVER =================
const PORT = process.env.PORT || 5000;
const path = require('path');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(
      path.resolve(__dirname, '../frontend/build', 'index.html')
    );
  });
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));