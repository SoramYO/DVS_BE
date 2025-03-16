const mongoose = require('mongoose');

const processStatusSchema = new mongoose.Schema({
  processStatus: { type: String, required: true },
  description: String,
  sequence: { type: Number, required: true },
  color: String
}, { collection: 'processStatuses' });

module.exports = mongoose.model('ProcessStatus', processStatusSchema);