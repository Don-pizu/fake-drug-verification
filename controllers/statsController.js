// controllers/statsController.js
const Verify = require("../models/verify");
const Awareness = require("../models/awareness");
const User = require("../models/User");

exports.getStats = async (req, res) => {
  try {
    // -------------------------
    // 1. Counts
    // -------------------------
    const totalProducts = await Verify.countDocuments();
    const totalVerifiedProducts = await Verify.countDocuments({ authentic: true });
    const totalReportedProducts = await Verify.countDocuments({ authentic: false });
    const totalNewLocations = await User.distinct("location").then(locs => locs.length);

    // -------------------------
    // 2. Last month range
    // -------------------------
    const now = new Date();
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const productsLastMonth = await Verify.countDocuments({
      createdAt: { $gte: firstDayLastMonth, $lte: lastDayLastMonth },
    });

    const reportedLastMonth = await Verify.countDocuments({
      authentic: false,
      createdAt: { $gte: firstDayLastMonth, $lte: lastDayLastMonth },
    });

    const verifiedLastMonth = await Verify.countDocuments({
      authentic: true,
      createdAt: { $gte: firstDayLastMonth, $lte: lastDayLastMonth },
    });

    const locationsLastMonth = await User.distinct("location", {
      createdAt: { $gte: firstDayLastMonth, $lte: lastDayLastMonth },
    });

    // -------------------------
    // 3. Calculate percentages
    // -------------------------
    function getPercent(current, last) {
      if (last === 0) return current > 0 ? 100 : 0;
      return (((current - last) / last) * 100).toFixed(1);
    }

    const percentProducts = getPercent(totalProducts, productsLastMonth);
    const percentReportedProducts = getPercent(totalReportedProducts, reportedLastMonth);
    const percentVerifiedProducts = getPercent(totalVerifiedProducts, verifiedLastMonth);
    const percentNewLocations = getPercent(totalNewLocations, locationsLastMonth.length);

    // -------------------------
    // 4. Send response
    // -------------------------
    res.json({
      totalProducts,
      totalReportedProducts,
      totalVerifiedProducts,
      totalNewLocations,
      percentProducts,
      percentReportedProducts,
      percentVerifiedProducts,
      percentNewLocations,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server Error" });
  }
};







/*
// controllers/statsController.js
const Verify = require("../models/verify");
const Awareness = require("../models/awareness");
const User = require("../models/User");

exports.getStats = async (req, res) => {
  try {
    // count all authentic products (verified = true)
    const verifiedCount = await Verify.countDocuments({ authentic: true });

    // count all reported products (authentic = false)
    const reportedCount = await Verify.countDocuments({ authentic: false });

    // count all awareness
    const awarenessCount = await Awareness.countDocuments();

    // count all users
    const userCount = await User.countDocuments();

    res.json({
      verifiedCount,
      reportedCount,
      awarenessCount,
      userCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server Error" });
  }
};
*/