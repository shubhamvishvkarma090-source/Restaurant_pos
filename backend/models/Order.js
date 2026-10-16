const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  orderType: { type: String, enum: ['Dine-in', 'Takeaway'], required: true },
  items: [{ menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true }, name: String, price: Number, quantity: { type: Number, min: 1, required: true } }],
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Preparing', 'Ready', 'Completed'], default: 'Pending' },
  paymentMethod: { type: String, enum: ['Cash', 'UPI'], default: null },
  paymentStatus: { type: String, enum: ['Unpaid', 'Paid'], default: 'Unpaid' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
module.exports = mongoose.model('Order', orderSchema);
