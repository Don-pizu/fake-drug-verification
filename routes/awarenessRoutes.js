//routes/awarenessRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const { createAwareness, allAwareness, getAwareness, updateAwareness, deleteAwareness } = require('../controllers/awarenessController');


router.post('/awareness', protect, upload.single('image'), createAwareness);
router.get('/Awareness', allAwareness);
router.get('/awareness/:id', getAwareness);
router.put('/awareness/:id', protect, upload.single('image'), updateAwareness);
router.delete('/awareness/:id', protect, deleteAwareness);

module.exports = router;