//controllers/feedbacController.js

const Feedback = require('../models/feedback');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// POST /api/feedback
exports.createFeedback = async (req, res) => {
  try {
    const { name, email, location, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required.' });
    }

    const feedback = await Feedback.create({ name, email, location, message });
    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/feedback (optional, to view all feedback)
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json({ success: true, count: feedbacks.length, data: feedbacks });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Get a single feedback by ID
exports.getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }
    res.json({ success: true, data: feedback });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update feedback by ID
exports.updateFeedback = async (req, res) => {
  try {
    const { name, email, location, message } = req.body;

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { name, email, location, message },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }
    res.json({ success: true, message: 'Feedback updated', data: feedback });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete feedback by ID
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }
    res.json({ success: true, message: 'Feedback deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
