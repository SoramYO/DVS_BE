//Create table tblProcess have id: int processStatus: nvarchar actor: nvarchar
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ProcessSchema = new Schema({
    processStatus: { type: String },
    actor: { type: String }
});

const Process = mongoose.model('Process', ProcessSchema);

module.exports = Process;