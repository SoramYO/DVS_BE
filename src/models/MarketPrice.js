const mongoose = require('mongoose');

const caratRangeSchema = new mongoose.Schema({
  min: Number,
  max: Number
});

const marketPriceSchema = new mongoose.Schema({
  shape: String,
  carat: Number,
  caratRange: caratRangeSchema,
  color: String,
  clarity: String,
  cut: String,
  pricePerCarat: Number,
  totalPrice: Number,
  updatedAt: Date,
  source: String,
  marketType: { type: String, enum: ["Retail", "Wholesale", "Auction", "RapNet", "Other"] }
}, { collection: 'marketPrices' });

marketPriceSchema.index({ shape: 1, color: 1, clarity: 1, cut: 1 });
marketPriceSchema.index({ updatedAt: -1 });

module.exports = mongoose.model('MarketPrice', marketPriceSchema);