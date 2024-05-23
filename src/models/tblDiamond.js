//table tblShape have id: int + name: nvarchar + image: nvarchar
//table tblDiamond + id: int + proportions: nvarchar + diamondOrigin: nvarchar + caratWeight: float + measurements: nvarchar + polish: nvarchar + flourescence: nvarchar + color: int + cut: int + shapeId: int + clarity: nvarchar + symmetry: nvarchar
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const DiamondSchema = new Schema({
    proportions: { type: String },
    diamondOrigin: { type: String },
    caratWeight: { type: Number },
    measurements: { type: String },
    polish: { type: String },
    flourescence: { type: String },
    color: { type: Number },
    cut: { type: Number },
    shape: { type: Number },
    clarity: { type: String },
    symmetry: { type: String }
});

const Diamond = mongoose.model('Diamond', DiamondSchema);

module.exports = Diamond;