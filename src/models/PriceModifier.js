const mongoose = require('mongoose');

const priceModifierSchema = new mongoose.Schema({
  modifierType: { type: String, enum: ["Fluorescence", "Polish", "Symmetry", "LengthToWidthRatio", "CertificateType", "Origin", "Treatment", "LabGrown"], required: true },
  condition: String,
  adjustmentType: { type: String, enum: ["Percentage", "FixedAmount"], required: true },
  adjustmentValue: { type: Number, required: true },
  description: String,
  applicableShapes: [String],
  effectiveDate: Date,
  expirationDate: Date,
  priority: Number,
  isActive: { type: Boolean, default: true }
}, { collection: 'priceModifiers' });

module.exports = mongoose.model('PriceModifier', priceModifierSchema);