// controllers/statsController.js
const Verify = require("../models/verify");
const Awareness = require("../models/awareness");
const User = require("../models/User");
const Report = require("../models/report");

exports.getStats = async (req, res) => {
  try {

    //1. Counts
    const totalProducts = await Verify.countDocuments();
    const totalVerifiedProducts = await Verify.countDocuments({ authentic: true });
    const totalReportedProducts = await Verify.countDocuments({ authentic: false });
    const totalNewLocations = await User.distinct("location").then(locs => locs.length);
    const awarenessCount = await Awareness.countDocuments();
    const reportCount = await Report.countDocuments();
    const userCount = await User.countDocuments();

   
    // 2. Last month range
    
    const now = new Date();
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

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

    const usersLastMonth = await User.countDocuments({
      createdAt: { $gte: firstDayLastMonth, $lte: lastDayLastMonth },
    });

    const awarenessLastMonth = await Awareness.countDocuments({
      createdAt: { $gte: firstDayLastMonth, $lte: lastDayLastMonth },
    });

    const reportLastMonth = await Report.countDocuments({
      createdAt: { $gte: firstDayLastMonth, $lte: lastDayLastMonth },
    });

    const recentAwareness = await Awareness.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    const engagementAgg = await Awareness.aggregate([
      {
        $group: {
          _id: null,
          totalEngagement: { $sum: { $add: ["$likesCount", "$commentsCount"] } }
        }
      }
    ]);

    const totalEngagement = engagementAgg[0]?.totalEngagement || 0;



     // ----  Active Users This Week ----
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const activeUsersThisWeek = await User.countDocuments({
      lastLogin: { $gte: startOfWeek, $lt: endOfWeek },
    });

    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
    const endOfLastWeek = new Date(startOfWeek);

    const activeUsersLastWeek = await User.countDocuments({
      lastLogin: { $gte: startOfLastWeek, $lt: endOfLastWeek },
    });

    const percentActive = activeUsersLastWeek === 0
      ? activeUsersThisWeek > 0 ? 100 : 0
      : (((activeUsersThisWeek - activeUsersLastWeek) / activeUsersLastWeek) * 100).toFixed(1);



    // ----  New Users This Month ----
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const newUsersLastMonth = await User.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });

    const percentNew = newUsersLastMonth === 0
      ? newUsersThisMonth > 0 ? 100 : 0
      : (((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100).toFixed(1);



   
    // 3. Calculate percentages
    function getPercent(current, last) {
      if (last === 0) return current > 0 ? 100 : 0;
      return (((current - last) / last) * 100).toFixed(1);
    }

    const percentProducts = getPercent(totalProducts, productsLastMonth);
    const percentReportedProducts = getPercent(totalReportedProducts, reportedLastMonth);
    const percentVerifiedProducts = getPercent(totalVerifiedProducts, verifiedLastMonth);
    const percentNewLocations = getPercent(totalNewLocations, locationsLastMonth.length);
    const percentAwareness = getPercent(awarenessCount, awarenessLastMonth);
    const percentUsers = getPercent(userCount, usersLastMonth);
    const percentReport = getPercent(reportCount, reportLastMonth);
    const percentEngagement = getPercent(totalEngagement, awarenessCount);
    const percentRecent = getPercent(recentAwareness, awarenessCount); 


    // -------------------------
    // 4. Send response
    // -------------------------
    res.json({
      totalProducts,
      totalReportedProducts,
      totalVerifiedProducts,
      totalNewLocations,
      userCount,
      activeUsersThisWeek,
      newUsersThisMonth,
      awarenessCount,
      recentAwareness,
      reportCount,
      totalEngagement,
      percentProducts,
      percentReportedProducts,
      percentVerifiedProducts,
      percentNewLocations,
      percentUsers,
      percentAwareness,
      percentReport,
      percentEngagement,
      percentRecent,
      percentActive,
       percentNew,
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