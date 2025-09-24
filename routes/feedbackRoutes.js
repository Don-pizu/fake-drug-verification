//routes/feedbackRoutes.js

const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');

// create new feedback
router.post('/feedbacks', feedbackController.createFeedback);

// optional: get all feedback
router.get('/feedbacks', protect, feedbackController.getAllFeedback);

router.get('/feedbacks/:id', protect, feedbackController.getFeedbackById);     
router.put('/feedbacks/:id', protect, feedbackController.updateFeedback);      
router.delete('/feedbacks/:id', protect, feedbackController.deleteFeedback);   


module.exports = router;
