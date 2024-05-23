//--Create table tblResult extend all from tblRequest and have id: int requestId: int price: float companyName: nvarchar dateValued: date
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ResultSchema = new Schema({
    requestId: { type: Number },
    price: { type: Number },
    companyName: { type: String },
    dateValued: { type: Date }
});
const Result = mongoose.model('Result', ResultSchema);
module.exports = Result;