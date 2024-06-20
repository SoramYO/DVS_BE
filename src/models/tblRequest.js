//Create table tblRequest have + id: int + note: nvarchar + createdDate: date + appointmentDate: date + diamondId: int + userId: int + processId: int
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const RequestSchema = new Schema({
    note: { type: String },
    createdDate: { type: Date },
    appointmentDate: { type: Date },
    diamondId: { type: Number },
    userId: { type: Number },
    processId: { type: Number }
});
const Request = mongoose.model('Request', RequestSchema);
module.exports = Request;