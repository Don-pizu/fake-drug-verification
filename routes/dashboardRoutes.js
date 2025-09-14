const express = require('express');
const router = express.Router();
const Verify = require('../models/verify');
const Report = require('../models/report');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// Dashboard stats
router.get('/dashboard', protect, async (req, res) => {
  try {
    const now = new Date();

    // Current month range
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1); // exclusive

    // Last month range
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 1); // exclusive

    // ===== TOTALS (all-time) =====
    const totalProducts = await Verify.countDocuments();
    const totalReportedProducts = await Report.countDocuments();
    const totalVerifiedProducts = await Verify.countDocuments({ authentic: true });
    const users = await User.find({}, "location");
    const uniqueLocations = new Set(users.map(u => u.location).filter(Boolean));

    // ===== CURRENT MONTH =====
    const currentProducts = await Verify.countDocuments({ createdAt: { $gte: startOfMonth, $lt: endOfMonth } });
    const currentReports = await Report.countDocuments({ createdAt: { $gte: startOfMonth, $lt: endOfMonth } });
    const currentVerified = await Verify.countDocuments({ authentic: true, createdAt: { $gte: startOfMonth, $lt: endOfMonth } });
    const currentLocations = new Set(
      (await User.find({ createdAt: { $gte: startOfMonth, $lt: endOfMonth } }, "location"))
        .map(u => u.location)
        .filter(Boolean)
    );

    // ===== LAST MONTH =====
    const lastProducts = await Verify.countDocuments({ createdAt: { $gte: startOfLastMonth, $lt: endOfLastMonth } });
    const lastReports = await Report.countDocuments({ createdAt: { $gte: startOfLastMonth, $lt: endOfLastMonth } });
    const lastVerified = await Verify.countDocuments({ authentic: true, createdAt: { $gte: startOfLastMonth, $lt: endOfLastMonth } });
    const lastLocations = new Set(
      (await User.find({ createdAt: { $gte: startOfLastMonth, $lt: endOfLastMonth } }, "location"))
        .map(u => u.location)
        .filter(Boolean)
    );

    // ===== % CHANGE =====
    const percentChange = (current, last) => {
      if (last === 0 && current > 0) return 100;
      if (last === 0 && current === 0) return 0;
      return parseFloat(((current - last) / last * 100).toFixed(2));
    };

    res.json({
      totalProducts,
      totalReportedProducts,
      totalVerifiedProducts,
      totalNewLocations: uniqueLocations.size,
      percentProducts: percentChange(currentProducts, lastProducts),
      percentReportedProducts: percentChange(currentReports, lastReports),
      percentVerifiedProducts: percentChange(currentVerified, lastVerified),
      percentNewLocations: percentChange(currentLocations.size, lastLocations.size),
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal server error" });
  }
});

module.exports = router;
