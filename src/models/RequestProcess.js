const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
  actionType: String,
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  timestamp: Date,
  notes: String
});

const attachmentSchema = new mongoose.Schema({
  fileUrl: String,
  fileName: String,
  fileType: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  uploadDate: Date
});

const requestProcessSchema = new mongoose.Schema({
  requestType: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  finishDate: Date,
  description: String,
  status: { type: String, enum: ["Pending", "InProgress", "Completed", "Canceled", "OnHold"], required: true },
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  processId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProcessStatus' },
  stepNumber: Number,
  actions: [actionSchema],
  attachments: [attachmentSchema]
}, { collection: 'requestProcesses' });

module.exports = mongoose.model('RequestProcess', requestProcessSchema);