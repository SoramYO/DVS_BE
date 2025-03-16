const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request' },
  customerName: String,
  email: String,
  feedbackText: String,
  createdAt: { type: Date, default: Date.now },
  rating: { type: Number, min: 1, max: 5 },
  category: { type: String, enum: ["Service", "Valuation", "Website", "Staff", "Other"] },
  status: { type: String, enum: ["New", "InProgress", "Resolved", "Closed"] },
  response: String,
  responseDate: Date,
  responderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }
}, { collection: 'feedback' });

module.exports = mongoose.model('Feedback', feedbackSchema);