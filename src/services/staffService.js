var { connectDB, sql } = require('../config/connectDb');


let confirmRequest = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await connectDB;
            let request = await pool.request().query(`
            UPDATE Request
            SET processId = 2
            WHERE id = ${data.requestId}
        `);
            resolve({
                errCode: 0,
                message: 'Confirm request successful'
            });
        } catch (error) {
            reject(error);
        }
    });
}





module.exports = {
    confirmRequest: confirmRequest
}