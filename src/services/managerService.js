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

const approveRequest = async (receiver, requestId, status) => {
    try {

        let pool = await sql.connect(config);


        let processIdQuery = await pool.request()
            .input('status', sql.NVarChar(50), status)
            .query('SELECT id FROM Processes WHERE processStatus = @status');

        if (!processIdQuery.recordset || processIdQuery.recordset.length === 0) {
            throw new Error(`No processId found for requestType ${requestType}`);
        }

        let processId = processIdQuery.recordset[0].id;

        let result = await pool.request()
            .input('requestId', sql.Int, requestId)
            .input('status', sql.NVarChar(50), status)
            .input('receiver', sql.Int, receiver)
            .input('processId', sql.Int, processId)
            .query(`
                UPDATE RequestProcesses
                SET status = @status,
                    receiver = @receiver,
                    finishDate = GETDATE(),
                    processId = @processId
                WHERE requestId = @requestId
                AND receiver IS NULL
                AND requestType IN ('Sealing', 'Commitment')

                UPDATE RequestProcesses
                SET processId = @processId
                WHERE requestId = @requestId
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

const getBill = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let pool = await sql.connect(config);
            let bill = await pool.request().query(`
            SELECT r.id, r.paymentStatus,
                    a.firstName, a.lastName, a.email, a.phone,
                    p.paymentAmount, p.paymentDate,
                    s.serviceName
            FROM
                Requests r
            JOIN
                Account a ON r.userId = a.id
            JOIN
                Payments p ON r.id = p.requestId
            JOIN
                Services s ON r.serviceId = s.id
            ORDER BY
                r.createdDate DESC;
                `);
            resolve({ errorCode: 0, message: 'Get bill successfully', data: bill.recordset });
        } catch (error) {
            console.error('Error in managerService.getBill:', error);
            resolve({ errorCode: 1, message: 'Error from server' });
        }
    })
}


module.exports = {
    getStaff: getStaff,
    approveRequest: approveRequest,
    getRequestApproved: getRequestApproved,
    getBill: getBill
};
