const sql = require('mssql');
var config = require("../config/dbconfig");// Ensure you have a valid database configuration


const getStaff = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let pool = await sql.connect(config);
            let staff = await pool.request().query(`
                SELECT ac.id, ac.username, ac.firstName, ac.lastName, ac.email, ac.phone, ac.createdAt, ac.status, name as role
                FROM Account as ac
                JOIN Role role on ac.roleId = role.id
                WHERE roleId = 3 OR  roleId = 4
                ORDER BY ac.createdAt DESC`);
            resolve({ errorCode: 0, message: 'Get staff successfully', data: staff.recordset });
        } catch (error) {
            console.error('Error in managerService.getStaff:', error);
            resolve({ errorCode: 1, message: 'Error from server' });
        }
    })
};

const approveRequest = async (receiver, approvalId, status) => {
    try {
        // Validate status against allowed values
        if (!['Approved', 'Rejected'].includes(status)) {
            throw new Error('Invalid status');
        }

        let pool = await sql.connect(config);

        // Fetch requestType based on approvalId
        let requestTypeQuery = await pool.request()
            .input('approvalId', sql.Int, approvalId)
            .query('SELECT requestType FROM RequestProcesses WHERE id = @approvalId');

        if (!requestTypeQuery.recordset || requestTypeQuery.recordset.length === 0) {
            throw new Error(`No requestType found for approvalId ${approvalId}`);
        }

        let requestType = requestTypeQuery.recordset[0].requestType;

        // Fetch processId based on requestType
        let processIdQuery = await pool.request()
            .input('requestType', sql.NVarChar(255), requestType)
            .query('SELECT id FROM Processes WHERE processStatus = @requestType');

        if (!processIdQuery.recordset || processIdQuery.recordset.length === 0) {
            throw new Error(`No processId found for requestType ${requestType}`);
        }

        let processId = processIdQuery.recordset[0].id;

        // Update RequestProcesses table
        let result = await pool.request()
            .input('approvalId', sql.Int, approvalId)
            .input('status', sql.NVarChar(50), status)
            .input('receiver', sql.Int, receiver)
            .input('processId', sql.Int, processId)
            .query(`
                UPDATE RequestProcesses
                SET status = @status,
                    receiver = @receiver,
                    finishDate = GETDATE(),
                    processId = @processId
                WHERE id = @approvalId;
            `);

        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('Error in managerService.approveRequest:', error);
        throw error;
    }
};


module.exports = {
    getStaff: getStaff,
    approveRequest: approveRequest

};
