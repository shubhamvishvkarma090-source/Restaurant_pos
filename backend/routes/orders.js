const router = require('express').Router();
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
router.get('/', protect, async (req, res, next) => {
  try { res.json(await Order.find().sort({ createdAt: -1 }).limit(100)); } catch (e) { next(e); }
});
router.post('/', protect, async (req, res, next) => {
  try {
    const { orderType, items, discount = 0 } = req.body;
    if (!['Dine-in', 'Takeaway'].includes(orderType) || !Array.isArray(items) || !items.length) return res.status(400).json({ message: 'Choose order type and at least one item' });
    if (!Number.isFinite(Number(discount)) || Number(discount) < 0) return res.status(400).json({ message: 'Discount must be non-negative' });
    const normalized = [];
    for (const line of items) {
      const quantity = Number(line.quantity);
      if (!line.menuItem || !Number.isInteger(quantity) || quantity < 1) return res.status(400).json({ message: 'Each item needs a valid ID and positive whole quantity' });
      const item = await MenuItem.findOne({ _id: line.menuItem, available: true });
      if (!item) return res.status(400).json({ message: 'A selected menu item is unavailable or missing' });
      normalized.push({ menuItem: item._id, name: item.name, price: item.price, quantity });
    }
    const subtotal = Number(normalized.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2));
    const safeDiscount = Number(Math.min(Number(discount), subtotal).toFixed(2));
    const taxRate = Math.max(0, Number(process.env.TAX_PERCENT || 5));
    const tax = Number(((subtotal - safeDiscount) * taxRate / 100).toFixed(2));
    const total = Number((subtotal - safeDiscount + tax).toFixed(2));
    const order = await Order.create({ orderNumber: `POS-${Date.now()}`, orderType, items: normalized, subtotal, tax, discount: safeDiscount, total, createdBy: req.user._id });
    res.status(201).json(order);
  } catch (e) { next(e); }
});
router.patch('/:id/status', protect, async (req, res, next) => {
  try {
    const allowed = ['Pending', 'Preparing', 'Ready', 'Completed'];
    if (!allowed.includes(req.body.status)) return res.status(400).json({ message: 'Invalid status' });
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const transitions = { Pending: ['Preparing'], Preparing: ['Ready'], Ready: ['Completed'], Completed: [] };
    if (req.body.status !== order.status && !transitions[order.status].includes(req.body.status)) return res.status(400).json({ message: `Cannot change ${order.status} to ${req.body.status}` });
    order.status = req.body.status; await order.save(); res.json(order);
  } catch (e) { next(e); }
});
router.post('/:id/payment', protect, async (req, res, next) => {
  try {
    const { method } = req.body;
    if (!['Cash', 'UPI'].includes(method)) return res.status(400).json({ message: 'Payment method must be Cash or UPI' });
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.paymentMethod = method; order.paymentStatus = 'Paid'; await order.save(); res.json(order);
  } catch (e) { next(e); }
});
module.exports = router;
