const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer=require('nodemailer');
const userModel = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');

const otpStore = {}; 

const signup = (req, res) => {
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    userModel.createUser(req.body, (err, result) => {
        if (err) return res.status(500).json({ message: 'Error signing up' });
        res.status(201).json({ message: 'User registered' });
    });
};


const login = (req, res) => {
  const { email, password } = req.body;

  userModel.getUserByEmail(email, async (err, results) => {
      if (err || results.length === 0) {
          return res.status(401).json({ message: 'User not found' });
      }

      const user = results[0];
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
          return res.status(401).json({ message: 'Incorrect password' });
      }

      const token = jwt.sign({ userId: user.id }, 'secretkey', { expiresIn: '1h' });

      res.json({ message: 'Login successful', token });
  });
};


const otps = new Map();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "info.trietreetech@gmail.com",
    pass: "luof wcll xoyj dbdc",
  },
});

 const sendOtp = async (req, res) => {
  const { emailOrMobile  } = req.body;

  const otp = uuidv4().slice(0, 6);
  otps.set(emailOrMobile , otp);

  const mailOptions = {
    from: "info.trietreetech@gmail.com",
    to: emailOrMobile ,
    subject: "Your OTP for Job Portal Registration",
    text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending OTP", error: error.message });
  }
};


const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();


 const storeOtp = async (email, otp) => {
  const hashedOtp = await bcrypt.hash(otp, 10);
  otpStore[email] = { otp: hashedOtp, expires: Date.now() + 5 * 60 * 1000 };
};

const verifyOtp = (req, res) => {
  const { emailOrMobile, otp } = req.body;
  console.log('emailOrMobile:', emailOrMobile);
  console.log('otp:', otp);
  console.log('otps:', otps);
  console.log('otps.get(emailOrMobile) === otp:', otps.get(emailOrMobile) === otp);  
  if (otps.get(emailOrMobile) === otp) {
    otps.delete(emailOrMobile);  
    res.status(200).json({ message: "OTP verified successfully" });
  } else {
    res.status(400).json({ message: "Invalid or expired OTP" });
  }
};




module.exports = { signup, login, verifyOtp ,sendOtp,generateOtp,storeOtp};
