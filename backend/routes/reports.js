const router = require('express').Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
router.get('/daily-sales', protect, async (req, res, next) => {
  try {
    const now = new Date();
    const start = new Date(now); start.setHours(0,0,0,0);
    const end = new Date(now); end.setHours(23,59,59,999);
    const [totalOrders, completedOrders, sales] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: start, $lte: end } }),
      Order.countDocuments({ createdAt: { $gte: start, $lte: end }, status: 'Completed' }),
      Order.aggregate([{ $match: { createdAt: { $gte: start, $lte: end }, paymentStatus: 'Paid' } }, { $group: { _id: null, total: { $sum: '$total' } } }])
    ]);
    const recentOrders = await Order.find({ createdAt: { $gte: start, $lte: end } }).sort({ createdAt: -1 }).limit(5);
    res.json({ totalOrders, completedOrders, dailySales: sales[0]?.total || 0, recentOrders });
  } catch (e) { next(e); }
});
module.exports = router;
