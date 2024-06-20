var config = require('../config/dbconfig');
const sql = require("mssql");

const takeRequest = async (staffId, requestId) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('requestId', sql.Int, requestId)
            .input('staffId', sql.Int, staffId)
            .query(`
                UPDATE RequestProcesses
                SET requestType = 'Approved',
                    receiver = @staffId, finishDate = GETDATE(),
                    processId = (SELECT id FROM Processes WHERE processStatus = 'Approved'),
                    status = 'TakeByConsulting'
                WHERE requestId = @requestId AND receiver IS NULL;
            `);
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('Error in managerService.takeRequest:', error);
        throw error;
    }
};

const takeRequestForValuation = async (staffId, requestId) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('requestId', sql.Int, requestId)
            .input('staffId', sql.Int, staffId)
            .query(`
                UPDATE RequestProcesses
                SET requestType = 'Valuated',
                    receiver = @staffId, finishDate = GETDATE(),
                    processId = (SELECT id FROM Processes WHERE processStatus = 'Valuated'),
                    status = 'TakeByValuation'
                WHERE requestId = @requestId AND receiver IS NULL AND requestType = 'Ready for valuation';
            `);
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('Error in managerService.takeRequestForValuation:', error);
        throw error;
    }
};

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

const valuation = (body, params) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect(config);
            let certificateId;
            let isUnique = false;

            while (!isUnique) {
                certificateId = 'CER' + Math.floor(100000000 + Math.random() * 900000000).toString();
                const result = await pool.request().query(`
                    SELECT COUNT(*) AS count
                    FROM Diamonds
                    WHERE certificateId = '${certificateId}'
                `);

                if (result.recordset[0].count === 0) {
                    isUnique = true;
                }
            }

            const request = pool.request();
            request.input('certificateId', sql.NVarChar, certificateId);
            request.input('proportions', sql.NVarChar, body.proportions);
            request.input('diamondOrigin', sql.NVarChar, body.diamondOrigin);
            request.input('caratWeight', sql.Float, body.caratWeight);
            request.input('measurements', sql.NVarChar, body.measurements);
            request.input('polish', sql.NVarChar, body.polish);
            request.input('fluorescence', sql.NVarChar, body.fluorescence);
            request.input('color', sql.NVarChar, body.color);
            request.input('cut', sql.NVarChar, body.cut);
            request.input('clarity', sql.NVarChar, body.clarity);
            request.input('symmetry', sql.NVarChar, body.symmetry);
            request.input('shape', sql.NVarChar, body.shape);
            request.input('id', sql.Int, params.id);

            await request.query(`
                UPDATE Diamonds
                SET certificateId = @certificateId,
                    proportions = @proportions,
                    diamondOrigin = @diamondOrigin,
                    caratWeight = @caratWeight,
                    measurements = @measurements,
                    polish = @polish,
                    fluorescence = @fluorescence,
                    color = @color,
                    cut = @cut,
                    clarity = @clarity,
                    symmetry = @symmetry,
                    shape = @shape
                WHERE id = (
                    SELECT diamondId
                    FROM Requests
                    WHERE id = @id
                );
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

const printValuationReport = async (requestId) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('requestId', sql.Int, requestId)
            .query(`
                SELECT r.id AS requestId, r.requestImage, r.note, r.createdDate, r.appointmentDate, r.paymentStatus,
                    a.username AS customerUsername, a.firstName AS customerFirstName, a.lastName AS customerLastName,
                    dia.proportions, dia.diamondOrigin, dia.caratWeight, dia.measurements, dia.polish, dia.fluorescence, dia.color, dia.cut, dia.clarity, dia.symmetry, dia.shape,
                    re.price, re.companyName, re.dateValued AS valuationDate
                FROM Requests r
                JOIN Account a ON r.userId = a.id
                LEFT JOIN Diamonds dia ON r.diamondId = dia.id
                LEFT JOIN Results re ON r.id = re.requestId
                WHERE r.id = @requestId;
            `);
        return result.recordset[0];
    } catch (error) {
        console.error('Error in valuationService.printValuationReport:', error);
        throw error;
    }
};
const requestApproval = async (staffId, requestId, requestType, description) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('requestId', sql.Int, requestId)
            .input('requestType', sql.NVarChar(255), requestType)
            .input('description', sql.NVarChar(1000), description)
            .input('status', sql.NVarChar(50), 'Pending')
            .input('staffId', sql.Int, staffId)
            .input('processId', sql.Int, (await pool.request()
                .query('SELECT TOP 1 processId FROM RequestProcesses ORDER BY finishDate DESC')).recordset[0].processId)
            .query(`
                INSERT INTO RequestProcesses (requestType, description, status, staffId, processId, requestId)
                VALUES (@requestType, @description, @status, @staffId, @processId, @requestId)
            `);
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('Error in staffService.requestApproval:', error);
        throw error;
    }
};

const receiveDiamond = async (requestId, receivedBy) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('requestId', sql.Int, requestId)
            .input('receivedBy', sql.Int, receivedBy)
            .query(`
                UPDATE RequestProcesses
                SET processId = (SELECT id FROM Processes WHERE processStatus = 'Ready for valuation')
                WHERE requestId = @requestId;
            `);
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('Error in diamondService.receiveDiamond:', error);
        throw error;
    }
};

const sendValuationResult = async (requestId, valuationResultId) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('requestId', sql.Int, requestId)
            .input('valuationResultId', sql.Int, valuationResultId)
            .query(`
                DECLARE @processId INT;
                
                SET @processId = (
                    SELECT TOP 1 id
                    FROM Processes
                    WHERE processStatus = 'Sent to Consulting'
                        AND actor = 'Valuation Staff'
                    ORDER BY id
                );

                UPDATE Requests
                SET processId = @processId
                WHERE id = @requestId;

                INSERT INTO RequestProcesses (requestId, processId, processDay, userId)
                VALUES (@requestId, @processId, GETDATE(), @valuationResultId);
            `);
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('Error in valuationService.sendValuationResult:', error);
        throw error;
    }
};

const sendValuationResultToCustomer = async (requestId, sentBy) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('requestId', sql.Int, requestId)
            .input('sentBy', sql.Int, sentBy)
            .query(`
                DECLARE @processId INT;

                SET @processId = (
                    SELECT TOP 1 id
                    FROM Processes
                    WHERE processStatus = 'Result Sent to Customer'
                        AND actor = 'Consulting Staff'
                    ORDER BY id
                );

                UPDATE Requests
                SET processId = @processId
                WHERE id = @requestId;

                INSERT INTO RequestProcesses (requestId, userId, processId, processDay)
                VALUES (@requestId, @sentBy, @processId, GETDATE());
            `);
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('Error in consultingService.sendValuationResultToCustomer:', error);
        throw error;
    }
};

const sendDiamondToValuation = async (requestId, sentBy) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('requestId', sql.Int, requestId)
            .input('sentBy', sql.Int, sentBy)
            .query(`
                UPDATE RequestProcesses
                SET processId = (SELECT id FROM Processes WHERE processStatus = 'Start Valuated')
                WHERE requestId = @requestId;


                DECLARE @processId INT;
                
                SET @processId = (
                    SELECT id
                    FROM Processes
                    WHERE processStatus = 'Start Valuated'
                );

                INSERT INTO RequestProcesses (requestType, requestId, sender, processId)
                VALUES ('Ready for valuation', @requestId, @sentBy, @processId);
            `);
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('Error in consultingService.sendDiamondToValuation:', error);
        throw error;
    }
};

const approveCommitment = async (receiver, commitmentId, status) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('commitmentId', sql.Int, commitmentId)
            .input('status', sql.NVarChar(50), status)
            .input('receiver', sql.Int, receiver)
            .query(`
                UPDATE Commitments
                SET status = @status, approvedBy = @receiver, approvedAt = GETDATE()
                WHERE id = @commitmentId;
            `);
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('Error in managerService.approveCommitment:', error);
        throw error;
    }
};

const getNewRequest = async () => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .query(`
                SELECT r.id AS requestId, r.requestImage,  r.note,  r.createdDate,  r.paymentStatus, s.serviceName, rp.status, p.processStatus
                FROM
                    Requests r
                JOIN
                    RequestProcesses rp ON r.id = rp.requestId
                JOIN
                    Processes p ON rp.processId = p.id
                JOIN
                    Services s ON r.serviceId = s.id
                JOIN
                    Account a ON rp.sender = a.id
                WHERE
                    rp.receiver IS NULL
                    AND a.roleId = 5
                ORDER BY
                    r.createdDate DESC;
            `);

        return result.recordset;
    } catch (error) {
        console.error('Error in staffService.getNewRequest:', error);
        throw error;
    }
}
const getRequestReadyForValuation = async () => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .query(`
                SELECT r.id AS requestId, r.requestImage,  r.note,  r.createdDate,  r.paymentStatus, s.serviceName, rp.status, p.processStatus
                FROM
                    Requests r
                JOIN
                    RequestProcesses rp ON r.id = rp.requestId
                JOIN
                    Processes p ON rp.processId = p.id
                JOIN
                    Services s ON r.serviceId = s.id
                WHERE
                    rp.receiver IS NULL
                    AND p.processStatus = 'Start Valuated'
                ORDER BY
                    r.createdDate DESC;
            `);

        return result.recordset;
    } catch (error) {
        console.error('Error in staffService.getRequestReadyForValuation:', error);
        throw error;
    }
}

const bookingsAppoinment = async (id, appointmentDate) => {
    try {
        let appointmentDateIn = new Date(appointmentDate);
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('requestId', sql.Int, id)
            .input('appointmentDate', sql.DateTime, appointmentDateIn)
            .query(`
                UPDATE Requests
                SET appointmentDate = @appointmentDate
                WHERE id = @requestId;

                UPDATE RequestProcesses
                SET finishDate = GETDATE(),
                    processId = (SELECT id FROM Processes WHERE processStatus = 'Booked Appointment')
                WHERE requestId = @requestId;
            `);
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('Error in staffService.bookingsAppoinment:', error);
        throw error;
    }
};

const getTakenRequestByStaff = async (staffId) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('staffId', sql.Int, staffId)
            .query(`
                SELECT r.id AS requestId, r.requestImage,  r.note,  r.createdDate,  r.paymentStatus, s.serviceName, rp.status, p.processStatus
                FROM
                    Requests r
                JOIN
                    RequestProcesses rp ON r.id = rp.requestId
                JOIN
                    Processes p ON rp.processId = p.id
                JOIN
                    Services s ON r.serviceId = s.id
                WHERE
                    rp.receiver = @staffId
                ORDER BY
                    r.createdDate DESC;
            `);

        return result.recordset;
    } catch (error) {
        console.error('Error in staffService.getTakenRequestByStaff:', error);
        throw error;
    }
}

const getRequestTakenByValuation = async (staffId) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('staffId', sql.Int, staffId)
            .query(`
                SELECT r.id AS requestId, r.requestImage,  r.note,  r.createdDate,  r.paymentStatus, s.serviceName, rp.status, p.processStatus
                FROM
                    Requests r
                JOIN
                    RequestProcesses rp ON r.id = rp.requestId
                JOIN
                    Processes p ON rp.processId = p.id
                JOIN
                    Services s ON r.serviceId = s.id
                WHERE
                    rp.receiver = @staffId
                    AND rp.status = 'TakeByValuation'
                ORDER BY
                    r.createdDate DESC;
            `);

        return result.recordset;
    } catch (error) {
        console.error('Error in staffService.getRequestTakenByValuation:', error);
        throw error;
    }
}

module.exports = {
    takeRequest: takeRequest,
    getRequestTakenByValuation: getRequestTakenByValuation,
    changeProcess: changeProcess,
    valuation: valuation,
    printValuationReport: printValuationReport,
    requestApproval: requestApproval,
    receiveDiamond: receiveDiamond,
    sendValuationResult: sendValuationResult,
    sendValuationResultToCustomer: sendValuationResultToCustomer,
    sendDiamondToValuation: sendDiamondToValuation,
    approveCommitment: approveCommitment,
    getNewRequest: getNewRequest,
    getRequestReadyForValuation: getRequestReadyForValuation,
    bookingsAppoinment: bookingsAppoinment,
    getTakenRequestByStaff: getTakenRequestByStaff,
    takeRequestForValuation: takeRequestForValuation,

}