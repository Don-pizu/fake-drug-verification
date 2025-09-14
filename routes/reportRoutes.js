// routes/reportRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const { createReport, allReports, getReport, updateReport, deleteReport } = require('../controllers/reportController.js');


router.post('/report', protect, upload.single('image'), createReport);
router.get('/reportall', allReports);
router.get('/report/:nafdacReg', getReport);
router.put('/report/:id', protect, upload.single('image'), updateReport);
router.delete('/report/:id', protect, deleteReport);


module.exports = router;
