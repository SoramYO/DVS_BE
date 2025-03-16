const mongoose = require('mongoose');

const comparableStoneSchema = new mongoose.Schema({
  caratWeight: Number,
  color: String,
  clarity: String,
  cut: String,
  price: Number,
  source: String
});

const resultSchema = new mongoose.Schema({
  price: { type: Number, required: true },
  currency: { type: String, default: "USD" },
  companyName: { type: String, required: true },
  appraiserName: String,
  appraiserCredentials: String,
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true, unique: true },
  dateValued: { type: Date, required: true },
  valuationMethod: String,
  marketConditions: String,
  comparableStones: [comparableStoneSchema],
  certificateImages: [String],
  comments: String,
  retailReplacementValue: Number,
  wholesaleValue: Number,
  insuranceValue: Number,
  validityPeriod: Number
}, { collection: 'results' });

resultSchema.index({ requestId: 1 }, { unique: true });
resultSchema.index({ dateValued: -1 });
resultSchema.index({ companyName: 1 });

module.exports = mongoose.model('Result', resultSchema);