const mongoose = require('mongoose');

const valuationImpactSchema = new mongoose.Schema({
  impactType: { type: String, enum: ["Positive", "Negative", "Neutral"] },
  impactStrength: { type: String, enum: ["Slight", "Moderate", "Significant"] },
  averagePercentage: Number
});

const internationalEquivalentSchema = new mongoose.Schema({
  GIA: String,
  IGI: String,
  HRD: String,
  AGS: String
});

const gradeReferenceSchema = new mongoose.Schema({
  gradeType: { type: String, enum: ["Color", "Clarity", "Cut", "Polish", "Symmetry", "Fluorescence"], required: true },
  gradeName: { type: String, required: true },
  description: { type: String, required: true },
  rank: Number,
  imageExamples: [String],
  valuationImpact: valuationImpactSchema,
  internationalEquivalent: internationalEquivalentSchema
}, { collection: 'gradeReferences' });

module.exports = mongoose.model('GradeReference', gradeReferenceSchema);