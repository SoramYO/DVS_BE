const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  permissions: [{ type: String }],
  description: String
}, { collection: 'roles' });

module.exports = mongoose.model('Role', roleSchema);