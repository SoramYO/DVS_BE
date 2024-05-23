var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const RoleSchema = new Schema({
    id: { type: Number },
    name: { type: String },
    description: { type: String }
});
const Role = mongoose.model('Role', RoleSchema);
module.exports = Role;