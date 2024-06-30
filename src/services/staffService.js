var config = require('../config/dbconfig');
const sql = require("mssql");
const nodemailer = require("nodemailer");

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
                WHERE requestId = @requestId AND receiver IS NULL AND requestType = 'Valuation';
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

                INSERT INTO Results (price, companyName, requestId, dateValued)
                VALUES (${body.price}, 'Diamond Valuation', @id, GETDATE());
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
                    dia.certificateId, dia.proportions, dia.diamondOrigin, dia.caratWeight, dia.measurements, dia.polish, dia.fluorescence, dia.color, dia.cut, dia.clarity, dia.symmetry, dia.shape,
                    re.price AS diamondPrice, re.companyName, re.dateValued AS valuationDate
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


        let processQuery = `
            SELECT TOP 1 processId
            FROM RequestProcesses
            WHERE requestId = @requestId
            ORDER BY COALESCE(finishDate, createdDate) DESC
        `;
        let processResult = await pool.request()
            .input('requestId', sql.Int, requestId)
            .query(processQuery);

        let processId = processResult.recordset[0].processId;


        let insertQuery = `
            INSERT INTO RequestProcesses (requestType, description, status, sender, processId, requestId)
            VALUES (@requestType, @description, @status, @sender, @processId, @requestId)
        `;
        let result = await pool.request()
            .input('requestId', sql.Int, requestId)
            .input('requestType', sql.NVarChar(255), requestType)
            .input('description', sql.NVarChar(1000), description)
            .input('status', sql.NVarChar(50), 'Pending')
            .input('sender', sql.Int, staffId)
            .input('processId', sql.Int, processId)
            .query(insertQuery);

        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('Error in requestApproval:', error);
        throw error;
    }
};

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "Gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

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


        let dataToPrintReceipt = await pool.request()
            .input('id', sql.Int, requestId)
            .query(`
                SELECT req.id AS RequestID, req.requestImage, req.note, req.createdDate, req.appointmentDate, req.paymentStatus,
                    ac.firstName, ac.lastName, ac.email, ac.phone,
                    pro.processStatus,
                    ser.serviceName
                    FROM
                        Requests req
                    JOIN
                        Account ac ON req.userId = ac.id
                    JOIN
                        (   SELECT
                                requestId,
                                MAX(COALESCE(finishDate, createdDate)) AS maxFinishDate
                            FROM
                                RequestProcesses
                            WHERE
                                requestId = @id
                            GROUP BY
                                requestId
                        ) rp_max ON req.id = rp_max.requestId
                    JOIN
                        RequestProcesses rp ON req.id = rp.requestId
                        AND (rp.finishDate = rp_max.maxFinishDate OR (rp.finishDate IS NULL AND rp.createdDate = rp_max.maxFinishDate)) -- Điều kiện lấy ra dòng có finishDate hoặc createdDate là maxFinishDate
                    JOIN
                        Processes pro ON rp.processId = pro.id
                    JOIN
                        Services ser ON req.serviceId = ser.id
                    WHERE
                        req.id = @id;
            `);

        let receiptData = dataToPrintReceipt.recordset[0];
        const currentDate = new Date().toLocaleDateString('en-US');

        await transporter.sendMail({
            from: '"Diamond Valuation System" <no-reply@diamondvaluationsystem.com>',
            to: receiptData.email,
            subject: "Receipt for Diamond Valuation Request",
            html: `
                            <html>
                <head>
                    <title>Valuation Report</title>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/4.16.13/antd.min.css">
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f0f2f5;
                            margin: 0;
                            padding: 20px;
                        }
                        .container {
                            max-width: 800px;
                            margin: auto;
                            padding: 20px;
                            background-color: #fff;
                            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                            border-radius: 5px;
                        }
                        .header, .footer {
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        .header h1 {
                            color: #ff0000;
                            margin: 0;
                        }
                        .details {
                            display: flex;
                            justify-content: space-between;
                            margin-bottom: 20px;
                        }
                        .info {
                            flex: 1;
                            padding-right: 10px;
                        }
                        .info p {
                            margin: 10px 0;
                            font-size: 1.1em;
                            color: #666;
                        }
                        .info p strong {
                            color: #1890ff;
                        }
                        .diamond-image {
                            flex: 1;
                            text-align: right;
                            margin-top: 20px;
                        }
                        .diamond-image img {
                            max-width: 70%;
                            border: 1px solid #ccc;
                            border-radius: 5px;
                            padding: 5px;
                        }
                        .signature {
                            text-align: right;
                            margin-top: 50px;
                            padding-top: 20px;
                            border-top: 1px solid #ccc;
                        }
                        .signature img {
                            max-width: 100px;
                            height: auto;
                        }
                        .signature .sign {
                            margin-top: 20px;
                            font-size: 1.2em;
                            font-weight: bold;
                        }
                        .footer h3 {
                            color: #1890ff;
                            margin: 0;
                        }
                        .footer p {
                            margin: 5px 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Receipt Request</h1>
                        </div>
                        <div class="details">
                            <div class="info">
                                <p><strong>Print Date:</strong> ${currentDate}</p>
                                <p><strong>Appointment Date:</strong> ${new Date(receiptData.appointmentDate).toLocaleDateString('en-US')}</p>
                                <p><strong>Payment Status:</strong> ${receiptData.paymentStatus}</p>
                                <p><strong>Customer:</strong> ${receiptData.firstName} ${receiptData.lastName}</p>
                                <p><strong>Note:</strong> ${receiptData.note}</p>
                            </div>
                            <div class="diamond-image">
                                <img src="${receiptData.requestImage}" alt="Diamond Image"/>
                            </div>
                        </div>
                        <div class="signature">
                            <p>Authorized Signature:</p>
                            <img src="https://clipground.com/images/make-signature-clipart-1.jpg" alt="Signature"/>
                            <p class="sign">Brian</p>
                            <p>Valuation Expert</p>
                        </div>
                        <div class="footer">
                            <h3>Diamond Valuation</h3>
                            <p>VRG2+27 Dĩ An, Bình Dương, Việt Nam</p>
                            <p>Phone: 0032-3-233-91-60</p>
                            <p>Email: diamondvaluation@gmail.com</p>
                        </div>
                    </div>
                </body>
                </html>
                `,
        });

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
                UPDATE RequestProcesses
                SET processId = (SELECT id FROM Processes WHERE processStatus = 'Sent to Consulting')
                WHERE requestId = @requestId;

                DECLARE @processId INT;
                
                SET @processId = (
                    SELECT id
                    FROM Processes
                    WHERE processStatus = 'Sent to Consulting'
                );

                INSERT INTO RequestProcesses (requestType, requestId, sender, processId)
                VALUES ('Ready for return', @requestId, @valuationResultId, @processId);
            `);
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('Error in valuationService.sendValuationResult:', error);
        throw error;
    }
};

const sendValuationResultToCustomer = async (requestId, staffId) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('requestId', sql.Int, requestId)
            .input('receiver', sql.Int, staffId)
            .query(`
                UPDATE RequestProcesses
                SET
                    processId = (SELECT id FROM Processes WHERE processStatus = 'Completed')
                WHERE
                    requestId = @requestId
                    AND status = 'TakeByConsulting'
                    AND receiver = @receiver;

                UPDATE RequestProcesses
                SET
                    requestType = 'Return to customer',
                    receiver = (SELECT userId FROM Requests WHERE id = @requestId),
                    finishDate = GETDATE(),
                    processId = (SELECT id FROM Processes WHERE processStatus = 'Completed'),
                    status = 'TakeByCustomer'
                WHERE
                    requestId = @requestId
                    AND receiver IS NULL
                    AND status IS NULL;
            `);
        console.log(result);
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

const getFinishedRequest = async () => {
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
                        rp.requestType = 'Ready for return' AND
                        rp.receiver IS NULL
                        AND p.processStatus = 'Sent to Consulting'
                    ORDER BY
                        r.createdDate DESC;
            `);

        return result.recordset;
    } catch (error) {
        console.error('Error in staffService.getFinishedRequest:', error);
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
                        AND rp.requestType = 'Ready for valuation'
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
                SELECT r.id AS requestId, r.requestImage,  r.note,  r.createdDate,rp.finishDate,  r.paymentStatus, s.serviceName, rp.status, p.processStatus
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
                    AND rp.status = 'TakeByConsulting'
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

const customerTookSample = async (requestId) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('requestId', sql.Int, requestId)
            .query(`
                UPDATE RequestProcesses
                SET processId = (SELECT id FROM Processes WHERE processStatus = 'Done')
                WHERE requestId = @requestId;
            `);
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('Error in staffService.customerTookSample:', error);
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
    getFinishedRequest: getFinishedRequest,
    customerTookSample: customerTookSample

}