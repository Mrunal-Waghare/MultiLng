const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  contact: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }  // Auto delete expired OTP
  },
}, { timestamps: true });

module.exports = mongoose.model('Otp', otpSchema);
