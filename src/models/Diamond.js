const mongoose = require('mongoose');

const measurementsSchema = new mongoose.Schema({
  length: Number,
  width: Number,
  depth: Number,
  depthPercentage: Number,
  tablePercentage: Number
});

const proportionsSchema = new mongoose.Schema({
  crownHeight: Number,
  crownAngle: Number,
  pavilionDepth: Number,
  pavilionAngle: Number,
  girdleThickness: String,
  culetSize: String
});

const diamondSchema = new mongoose.Schema({
  certificateId: String,
  certificateType: { type: String, enum: ["GIA", "IGI", "HRD", "AGS", "DCLA", "GSI", "NONE", "OTHER"] },
  certificateImage: String,
  caratWeight: { type: Number, required: true },
  color: { type: String, enum: ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O-P", "Q-R", "S-T", "U-V", "W-X", "Y-Z", "Fancy"], required: true },
  clarity: { type: String, enum: ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "SI3", "I1", "I2", "I3"], required: true },
  cut: { type: String, enum: ["Excellent", "Very Good", "Good", "Fair", "Poor"], required: true },
  shape: { type: String, enum: ["Round", "Princess", "Cushion", "Emerald", "Oval", "Radiant", "Pear", "Heart", "Marquise", "Asscher", "Other"], required: true },
  measurements: measurementsSchema,
  proportions: proportionsSchema,
  polish: { type: String, enum: ["Excellent", "Very Good", "Good", "Fair", "Poor"] },
  symmetry: { type: String, enum: ["Excellent", "Very Good", "Good", "Fair", "Poor"] },
  fluorescence: { type: String, enum: ["None", "Faint", "Medium", "Strong", "Very Strong"] },
  fluorescenceColor: { type: String, enum: ["Blue", "Yellow", "Green", "White", "Orange", "Red", "None"] },
  diamondOrigin: String,
  images: [String],
  labGrowth: { type: Boolean, default: false },
  treatments: [String],
  girdle: String,
  culet: { type: String, enum: ["None", "Very Small", "Small", "Medium", "Slightly Large", "Large", "Very Large"] },
  marketValue: Number,
  lastValuationDate: Date,
  valuationHistory: [{
    date: Date,
    value: Number,
    appraiser: String
  }]
}, { collection: 'diamonds' });

diamondSchema.index({ certificateId: 1 }, { sparse: true });
diamondSchema.index({ shape: 1 });
diamondSchema.index({ caratWeight: 1 });
diamondSchema.index({ color: 1 });
diamondSchema.index({ clarity: 1 });
diamondSchema.index({ cut: 1 });
diamondSchema.index({ shape: 1, caratWeight: 1, color: 1, clarity: 1, cut: 1 }, { name: "diamond_search_compound" });

module.exports = mongoose.model('Diamond', diamondSchema);