const mongoose = require('mongoose');

const parameterSchema = new mongoose.Schema({
  name: String,
  description: String,
  defaultValue: Number
});

const valuationAlgorithmSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  formula: { type: String, required: true },
  parameters: [parameterSchema],
  isActive: { type: Boolean, default: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  createdAt: Date,
  modifiedAt: Date,
  version: String,
  applicableForShapes: [String]
}, { collection: 'valuationAlgorithms' });

module.exports = mongoose.model('ValuationAlgorithm', valuationAlgorithmSchema);