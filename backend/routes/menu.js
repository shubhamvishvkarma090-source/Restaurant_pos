const router = require('express').Router();
const MenuItem = require('../models/MenuItem');
const { protect, adminOnly } = require('../middleware/auth');
router.get('/', protect, async (req, res, next) => {
  try {
    const { search = '', category = '', includeUnavailable = 'false' } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) filter.category = category;
    if (includeUnavailable !== 'true') filter.available = true;
    res.json(await MenuItem.find(filter).sort({ category: 1, name: 1 }));
  } catch (e) { next(e); }
});
router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const { name, category, price } = req.body;
    if (!name?.trim() || !category?.trim() || !Number.isFinite(Number(price)) || Number(price) < 0) return res.status(400).json({ message: 'Valid name, category and non-negative price are required' });
    res.status(201).json(await MenuItem.create({ name: name.trim(), category: category.trim(), price: Number(price) }));
  } catch (e) { next(e); }
});
router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const allowed = {};
    for (const key of ['name', 'category', 'available']) if (req.body[key] !== undefined) allowed[key] = req.body[key];
    if (req.body.price !== undefined) {
      if (!Number.isFinite(Number(req.body.price)) || Number(req.body.price) < 0) return res.status(400).json({ message: 'Price must be non-negative' });
      allowed.price = Number(req.body.price);
    }
    const item = await MenuItem.findByIdAndUpdate(req.params.id, allowed, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    res.json(item);
  } catch (e) { next(e); }
});
module.exports = router;
