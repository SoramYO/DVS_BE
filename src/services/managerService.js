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
const approveRequest = async (managerId, approvalId, status) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('approvalId', sql.Int, approvalId)
            .input('status', sql.NVarChar(50), status)
            .input('managerId', sql.Int, managerId)
            .query(`
                UPDATE RequestApproval
                SET status = @status,
                    managerId = @managerId
                WHERE id = @approvalId;
                
                UPDATE Requests
                SET processId = (SELECT id FROM Processes WHERE processStatus = (SELECT requestType FROM RequestApproval WHERE id = @approvalId) AND actor = 'Manager')
                WHERE id = (SELECT requestId FROM RequestApproval WHERE id = @approvalId);
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
