const mongoose = require('mongoose');

const processHistorySchema = new mongoose.Schema({
  processId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProcessStatus' },
  status: String,
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  timestamp: Date,
  notes: String
});

const requestSchema = new mongoose.Schema({
  requestImages: [String],
  note: String,
  createdDate: { type: Date, required: true },
  appointmentDate: Date,
  paymentStatus: { type: String, enum: ["Pending", "Partial", "Completed", "Refunded", "Failed"], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  diamondId: { type: mongoose.Schema.Types.ObjectId, ref: 'Diamond', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  currentStatus: String,
  priority: { type: String, enum: ["Low", "Normal", "High", "Urgent"] },
  completionDate: Date,
  customerRequirements: [String],
  processHistory: [processHistorySchema]
}, { collection: 'requests' });

requestSchema.index({ userId: 1 });
requestSchema.index({ diamondId: 1 });
requestSchema.index({ createdDate: -1 });
requestSchema.index({ paymentStatus: 1 });
requestSchema.index({ currentStatus: 1 });

module.exports = mongoose.model('Request', requestSchema);