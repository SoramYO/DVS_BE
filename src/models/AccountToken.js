const mongoose = require('mongoose');

const accountTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  token: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  tokenType: { type: String, enum: ["ResetPassword", "EmailVerification", "AccessToken", "RefreshToken"], required: true },
  isUsed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  deviceInfo: {
    ip: String,
    userAgent: String,
    deviceType: String
  }
}, { collection: 'accountTokens' });

module.exports = mongoose.model('AccountToken', accountTokenSchema);