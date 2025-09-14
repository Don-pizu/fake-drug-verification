// routes/verifyRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const { createVerify, getByReg, getAll, getById, updateReg, deleteReg } = require('../controllers/verifyController.js');


router.post('/verify', protect, upload.single('image'), createVerify);
router.get('/verify/:nafdacReg', getByReg);
router.get('/verify', getAll);
router.get('/verifyId/:id', getById);
router.put('/verify/:id', protect, upload.single('image'), updateReg);
router.delete('/verify/:id', protect, deleteReg);


module.exports = router;
