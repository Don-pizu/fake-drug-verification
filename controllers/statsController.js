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
