//routes/profileRoutes.js

const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadImage } = require('../controllers/profileImageController');

const { protect } = require('../middleware/authMiddleware');  


// upload image with a simple setup
router.post('/upload-image', upload.single('image'), protect, uploadImage);

module.exports = router;