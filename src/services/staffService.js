var { connectDB, sql } = require('../config/connectDb');


let changeProcess = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await connectDB;
            const request = pool.request();

            request.input('processId', sql.Int, data.processId);
            request.input('id', sql.Int, data.id);

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