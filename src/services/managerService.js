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

        if (!['Approved', 'Rejected'].includes(status)) {
            throw new Error('Invalid status');
        }

        let pool = await sql.connect(config);

        let requestProcessQuery = await pool.request()
            .input('approvalId', sql.Int, approvalId)
            .query('SELECT requestType, requestId, sender FROM RequestProcesses WHERE id = @approvalId');

        if (!requestProcessQuery.recordset || requestProcessQuery.recordset.length === 0) {
            throw new Error(`No requestType or requestId found for approvalId ${approvalId}`);
        }

        let { requestType, requestId, sender } = requestProcessQuery.recordset[0];

        // Fetch processId based on requestType
        let processIdQuery = await pool.request()
            .input('requestType', sql.NVarChar(255), requestType)
            .query('SELECT id FROM Processes WHERE processStatus = @requestType');

        if (!processIdQuery.recordset || processIdQuery.recordset.length === 0) {
            throw new Error(`No processId found for requestType ${requestType}`);
        }

        let processId = processIdQuery.recordset[0].id;

        // Update the specific approval request
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
                WHERE id = @approvalId
                AND staffId = @staffId;
            `);

        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('Error in managerService.approveRequest:', error);
        throw error;
    }
};



const getRequestApproved = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let pool = await sql.connect(config);
            let requestApproved = await pool.request().query(`
            SELECT rp.id AS RequestProcessID, rp.requestId, rp.sender, rp.receiver, rp.status,
                rp.createdDate, rp.finishDate, rp.requestType, rp.description,
                r.requestImage, r.note, r.createdDate AS RequestCreatedDate, r.appointmentDate,
                a.firstName, a.lastName, a.email, a.phone, p.processStatus,
                b.firstName AS staffFirstName, b.lastName AS staffLastName
            FROM
                RequestProcesses rp
            JOIN
                Requests r ON rp.requestId = r.id
            JOIN
                Processes p ON rp.processId = p.id
            JOIN
                Account a ON r.userId = a.id
            JOIN
                Account b ON rp.sender = b.id
            WHERE
                rp.requestType IN ('Sealing', 'Commitment')
            ORDER BY
                rp.finishDate DESC;
                `);
            resolve({ errorCode: 0, message: 'Get request approved successfully', data: requestApproved.recordset });
        } catch (error) {
            console.error('Error in managerService.getRequestApproved:', error);
            resolve({ errorCode: 1, message: 'Error from server' });
        }
    })
}


module.exports = {
    getStaff: getStaff,
    approveRequest: approveRequest,
    getRequestApproved: getRequestApproved
};
