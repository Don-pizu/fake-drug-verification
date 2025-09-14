// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { register, verifyOtp, resendOtp, login, getAllUsers, forgotPassword, resetPassword } = require('../controllers/authController.js');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post("/verifyOtp", verifyOtp);
router.post("/resendOtp", resendOtp);
router.post('/forgotPassword', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/login', login);
router.get('/allusers', protect, getAllUsers)

module.exports = router;