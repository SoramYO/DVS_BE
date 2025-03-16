const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  serviceName: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  estimatedTime: Number,
  active: { type: Boolean, default: true },
  category: String
}, { collection: 'services' });

module.exports = mongoose.model('Service', serviceSchema);