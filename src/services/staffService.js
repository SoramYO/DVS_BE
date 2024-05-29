var { connectDB, sql } = require('../config/connectDb');


let changeProcess = (body, params) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await connectDB;
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




module.exports = {
    changeProcess: changeProcess
}