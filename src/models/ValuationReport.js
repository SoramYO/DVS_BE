const mongoose = require('mongoose');

const valuationReportSchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
  resultId: { type: mongoose.Schema.Types.ObjectId, ref: 'Result', required: true },
  reportNumber: { type: String, required: true },
  issueDate: { type: Date, required: true },
  expiryDate: Date,
  reportUrl: String,
  reportStatus: { type: String, enum: ["Draft", "Reviewed", "Finalized", "Issued", "Expired", "Revoked"] },
  reportType: { type: String, enum: ["Full", "Summary", "Insurance", "Appraisal", "Certificate"] },
  methodology: String,
  disclaimer: String,
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  isVerified: Boolean,
  verificationCode: String
}, { collection: 'valuationReports' });

module.exports = mongoose.model('ValuationReport', valuationReportSchema);