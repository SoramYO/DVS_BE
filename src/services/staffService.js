var config = require('../config/dbconfig');
const sql = require("mssql");


let changeProcess = (body, params) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect(config);
            const request = pool.request();

            request.input('processId', sql.Int, body.processId);
            request.input('id', sql.Int, params.id);
            await request.query(`
                UPDATE Request
                SET processId = @processId
                WHERE id = @id
            `);

            resolve({
                errCode: 0,
                message: 'Change process successful'
            });
        } catch (error) {
            reject(error);
        }
    });
}

let valuation = (body, params) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect(config);
            const request = pool.request();

            request.input('proportions', sql.NVarChar, body.proportions);
            request.input('diamondOrigin', sql.NVarChar, body.diamondOrigin);
            request.input('caratWeight', sql.Float, body.caratWeight);
            request.input('measurements', sql.NVarChar, body.measurements);
            request.input('polish', sql.NVarChar, body.polish);
            request.input('flourescence', sql.NVarChar, body.flourescence);
            request.input('color', sql.NVarChar, body.color);
            request.input('cut', sql.NVarChar, body.cut);
            request.input('clarity', sql.NVarChar, body.clarity);
            request.input('symmetry', sql.NVarChar, body.symmetry);
            request.input('shape', sql.NVarChar, body.shape);
            request.input('id', sql.Int, params.id);

            await request.query(`
                UPDATE Diamond
                SET
                    proportions = @proportions,
                    diamondOrigin = @diamondOrigin,
                    caratWeight = @caratWeight,
                    measurements = @measurements,
                    polish = @polish,
                    flourescence = @flourescence,
                    color = @color,
                    cut = @cut,
                    clarity = @clarity,
                    symmetry = @symmetry,
                    shape = @shape
                FROM Diamond d
                JOIN Request r ON d.id = r.diamondId
                WHERE r.id = @id
            `);

            resolve({
                errCode: 0,
                message: 'Valuation successful'
            });
        } catch (error) {
            reject({
                errCode: 1,
                message: 'Valuation failed',
                error: error.message
            });
        }
    });
};




module.exports = {
    changeProcess: changeProcess,
    valuation: valuation
}