var config = require('./dbconfig');
const sql = require('mssql');

async function getTblDiamond() {
    try {
        let pool = await sql.connect(config);
        let diamond = await pool.request().query("SELECT * from tblDiamond");
        return diamond.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}

async function getTblDiamondById(id) {
    try {
        let pool = await sql.connect(config);
        let diamond = await pool.request()
            .input('input_parameter', sql.Int, id)
            .query("SELECT * from tblDiamond where id = @input_parameter");
        return diamond.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}
async function add(diamond) {
    try {
        let pool = await sql.connect(config);
        let insertDiamond = await pool.request()
            .input('proportions', sql.NVarChar, diamond.proportions)
            .input('diamondOrigin', sql.NVarChar, diamond.diamondOrigin)
            .input('caratWeight', sql.Float, diamond.caratWeight)
            .input('measurements', sql.NVarChar, diamond.measurements)
            .input('polish', sql.NVarChar, diamond.polish)
            .input('flourescence', sql.NVarChar, diamond.flourescence)
            .input('color', sql.Int, diamond.color)
            .input('cut', sql.Int, diamond.cut)
            .input('shapeId', sql.Int, diamond.shapeId)
            .input('clarity', sql.NVarChar, diamond.clarity)
            .input('symmetry', sql.NVarChar, diamond.symmetry)
            .query("INSERT INTO tblDiamond (proportions, diamondOrigin, caratWeight, measurements, polish, flourescence, color, cut, shapeId, clarity, symmetry) VALUES (@proportions, @diamondOrigin, @caratWeight, @measurements, @polish, @flourescence, @color, @cut, @shapeId, @clarity, @symmetry)");
        return insertDiamond.recordsets;
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = {
    getTblDiamond: getTblDiamond,
    getTblDiamondById: getTblDiamondById,
    add: add
}
