const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: Number, required: true },
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  profileImage: String,
  lastLogin: Date
}, { collection: 'accounts' });

accountSchema.index({ username: 1 }, { unique: true });
accountSchema.index({ email: 1 }, { unique: true });
accountSchema.index({ roleId: 1 });

module.exports = mongoose.model('Account', accountSchema);