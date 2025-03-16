const mongoose = require('mongoose');

const caratRangeSchema = new mongoose.Schema({
  min: Number,
  max: Number
});

const comparisonDataSchema = new mongoose.Schema({
  shape: String,
  caratRange: caratRangeSchema,
  color: String,
  clarity: String,
  cut: String,
  polish: String,
  symmetry: String,
  certificate: String,
  price: Number,
  pricePerCarat: Number,
  source: String,
  date: Date,
  location: String,
  saleType: { type: String, enum: ["Retail", "Wholesale", "Auction"] }
}, { collection: 'comparisonData' });

module.exports = mongoose.model('ComparisonData', comparisonDataSchema);