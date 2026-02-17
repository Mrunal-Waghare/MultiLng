require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
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
app.use('/api/auth', authRoutes); 

// ================= OTP ROUTES =================
app.use('/api/otp', otpRoutes);

// ================= PRODUCTION FRONTEND =================
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(
      path.resolve(__dirname, '../frontend/build', 'index.html')
    );
  });
}

// ================= SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));