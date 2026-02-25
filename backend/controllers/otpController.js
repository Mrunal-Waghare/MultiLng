const Otp = require('../models/Otp');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

// ================= EMAIL SETUP =================
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});
// ================= SEND OTP =================
exports.sendOtp = async (req, res) => {
  try {
    const { language, contact } = req.body;

    if (!language || !contact) {
      return res.status(400).json({
        success: false,
        message: 'Language and contact are required'
      });
    }

    // Check if OTP already exists and not expired
    const existingOtp = await Otp.findOne({ contact });

    if (existingOtp && existingOtp.expiresAt > Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Please wait before requesting another OTP'
      });
    }

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const hashedOtp = await bcrypt.hash(otp, 10);

    // Remove old OTP
    await Otp.deleteMany({ contact });

    // Save new OTP
    await Otp.create({
      contact,
      otp: hashedOtp,
      language,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    // Send OTP via Email (for ALL languages)
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: contact,
      subject: 'Your Verification Code',
      text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
    });

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully'
    });

  } catch (error) {
    console.error('Send OTP Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error sending OTP'
    });
  }
};

// ================= VERIFY OTP =================
exports.verifyOtp = async (req, res) => {
  try {
    const { contact, otp } = req.body;

    if (!contact || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Contact and OTP are required'
      });
    }

    const record = await Otp.findOne({ contact });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Check expiry
    if (record.expiresAt < Date.now()) {
      await Otp.deleteOne({ _id: record._id });
      return res.status(400).json({
        success: false,
        message: 'OTP expired'
      });
    }

    // Compare hashed OTP
    const isMatch = await bcrypt.compare(otp, record.otp);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Delete OTP after success
    await Otp.deleteOne({ _id: record._id });

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully'
    });

  } catch (error) {
    console.error('Verify OTP Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Verification error'
    });
  }
};