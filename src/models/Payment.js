const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentAmount: { type: Number, required: true },
  currency: { type: String, default: "USD" },
  paymentDate: { type: Date, required: true },
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
  paymentMethod: { type: String, enum: ["Credit Card", "Bank Transfer", "Cash", "PayPal", "Crypto", "Other"] },
  transactionId: String,
  status: { type: String, enum: ["Pending", "Completed", "Failed", "Refunded"] },
  receiptUrl: String,
  notes: String
}, { collection: 'payments' });

module.exports = mongoose.model('Payment', paymentSchema);