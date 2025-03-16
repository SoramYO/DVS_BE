const mongoose = require('mongoose');

const marketTrendSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  category: { type: String, enum: ["All", "Round", "Fancy", "ColoredDiamonds", "LabGrown", "Investment"], required: true },
  trend: { type: String, enum: ["Up", "Down", "Stable"], required: true },
  percentageChange: { type: Number, required: true },
  source: String,
  notes: String,
  impactLevel: { type: String, enum: ["Low", "Medium", "High"] },
  predictedDuration: String,
  affectedAttributes: [String]
}, { collection: 'marketTrends' });

marketTrendSchema.index({ date: -1 });
marketTrendSchema.index({ category: 1, date: -1 });

module.exports = mongoose.model('MarketTrend', marketTrendSchema);