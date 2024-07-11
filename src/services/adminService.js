var bcrypt = require('bcryptjs');
var config = require('../config/dbconfig');
const sql = require("mssql");
const salt = bcrypt.genSaltSync(10);

let checkUserName = (username) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect(config);
            let user = await pool.request().query("SELECT username FROM Account WHERE username = '" + username + "'");
            if (user.recordset.length > 0) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getUserById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect(config);
            const user = await pool.request().query(`
            SELECT ac.id, ac.username, ac.firstName, ac.lastName, ac.email, ac.phone, ac.createdAt
            FROM Account as ac
            JOIN Role as r ON ac.roleId = r.id
            WHERE ac.id = ${id}
        `);
            resolve(user.recordset);
        } catch (error) {
            reject(error);
        }
    });
};

const getAllUsers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect(config);
            const users = await pool.request().query(`
            SELECT ac.id, ac.username, ac.firstName, ac.lastName, ac.email, ac.phone, ac.createdAt, ac.status, name as role
            FROM Account as ac
            JOIN Role as r ON ac.roleId = r.id
            ORDER BY ac.createdAt DESC
            `);
            resolve(users.recordset);
        } catch (error) {
            reject(error);
        }
    });
};

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isExist = await checkUserName(data.username);
            if (isExist) {
                resolve({
                    errCode: 1,
                    message: 'Username exist try another username!'
                });
            } else {
                if (data.password.length < 6) {
                    resolve({
                        errCode: 2,
                        message: 'Password must be at least 6 characters'
                    });
                }
                const pool = await sql.connect(config);
                const hashedPassword = await hashUserPassword(data.password)
                const request = pool.request();
                request.input('username', sql.NVarChar, data.username);
                request.input('password', sql.NVarChar, hashedPassword);
                request.input('firstName', sql.NVarChar, data.firstName);
                request.input('lastName', sql.NVarChar, data.lastName);
                request.input('email', sql.NVarChar, data.email);
                request.input('phone', sql.NVarChar, data.phone);
                request.input('status', sql.Int, 1);
                request.input('roleId', sql.Int, data.roleId);

                await request.query(`
                INSERT INTO Account (username, password, firstName, lastName, email, phone, status, roleId)
                VALUES (@username, @password, @firstName, @lastName, @email, @phone, @status, @roleId)
                `);

                resolve({
                    errCode: 0,
                    message: 'Create new user success'
                });
            }
        } catch (error) {
            reject(error);
        }
    });
}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error);
        }
    });
}

let updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect(config);
            const hashedPassword = data.password ? await hashUserPassword(data.password) : null;

            const request = pool.request();
            request.input('username', sql.NVarChar, data.username);
            let currentUserResult = await request.query(`SELECT * FROM Account WHERE username = @username`);
            let currentUser = currentUserResult.recordset[0];

            if (!currentUser) {
                return reject({
                    errCode: 1,
                    message: 'User not found'
                });
            }

            const updatedData = {
                password: hashedPassword ? hashedPassword : currentUser.password,
                status: currentUser.status,
                roleId: currentUser.roleId,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email ? data.email : '',
                phone: data.phone ? data.phone : ''
            };

            request.input('password', sql.NVarChar, updatedData.password);
            request.input('firstName', sql.NVarChar, updatedData.firstName);
            request.input('lastName', sql.NVarChar, updatedData.lastName);
            request.input('email', sql.NVarChar, updatedData.email);
            request.input('phone', sql.NVarChar, updatedData.phone);
            request.input('status', sql.Int, updatedData.status);
            request.input('roleId', sql.Int, updatedData.roleId);

            await request.query(`
                UPDATE Account
                SET password = @password, firstName = @firstName, lastName = @lastName, email = @email, phone = @phone, status = @status, roleId = @roleId
                WHERE username = @username
            `);

            resolve({
                errCode: 0,
                message: 'Update user success'
            });
        } catch (error) {
            reject(error);
        }
    });
};

let deleteUser = (data, query) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect(config);
            const request = pool.request();
            request.input('username', sql.NVarChar, query.username);
            let currentUserResult = await request.query(`SELECT * FROM Account WHERE username = @username`);
            let currentUser = currentUserResult.recordset[0];

            if (!currentUser) {
                return resolve({
                    errCode: 1,
                    message: 'User not found'
                });
            }

            request.input('status', sql.Int, data.status);
            await request.query(`
                UPDATE Account
                SET status = @status
                WHERE username = @username
            `);
            resolve({
                errCode: 0,
                message: 'Delete user success'
            });
        } catch (error) {
            reject(error);
        }
    });
}

let getDiamonds = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect(config);
            const diamonds = await pool.request().query(`
            SELECT id, certificateId, proportions, diamondOrigin, caratWeight, measurements, polish, fluorescence, color, cut, clarity, symmetry, shape
            FROM Diamonds;
        `);
            resolve(diamonds.recordset);
        } catch (error) {
            reject(error);
        }
    });
}

// let getRequests = () => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const pool = await sql.connect(config);
//             const requests = await pool.request().query(`
//             SELECT r.id AS RequestID, r.requestImage, r.note, r.createdDate, r.appointmentDate,
//             a.username, a.firstName, a.lastName, a.email, a.phone,
//             p.processStatus,
//             s.serviceName
//             FROM Requests r
//             JOIN Account a ON r.userId = a.id
//             JOIN Processes p ON r.processId = p.id
//             JOIN Services s ON r.serviceId = s.id
//             ORDER BY r.createdDate DESC;
//         `);
//             resolve(requests.recordset);
//         } catch (error) {
//             reject(error);
//         }
//     });
// }

const getRequests = async () => {
    try {
        let pool = await sql.connect(config);
        let requests = await pool.request().query(`
            SELECT req.id AS RequestID, req.requestImage, req.note, req.createdDate, req.appointmentDate, req.paymentStatus,
                    ac.firstName, ac.lastName, ac.email, ac.phone,
                    pro.processStatus,
                    ser.serviceName
            FROM
                Requests req
            JOIN
                Account ac ON req.userId = ac.id
            JOIN
                (SELECT
                        requestId,
                        MAX(COALESCE(finishDate, createdDate)) AS maxFinishDate
                    FROM
                        RequestProcesses
                    GROUP BY
                        requestId
                ) rp_max ON req.id = rp_max.requestId
            JOIN
                RequestProcesses rp ON req.id = rp.requestId
                AND (rp.finishDate = rp_max.maxFinishDate OR (rp.finishDate IS NULL AND rp.createdDate = rp_max.maxFinishDate))
            JOIN
                Processes pro ON rp.processId = pro.id
            JOIN
                Services ser ON req.serviceId = ser.id
            ORDER BY
                req.createdDate DESC;
        `);
        return requests.recordset;
    } catch (error) {
        console.error('Error in getRequests:', error);
        throw error;
    }
};



const getResults = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect(config);
            const results = await pool.request().query(`
                    SELECT 
                        res.id AS ResultID,
                        res.price,
                        res.companyName,
                        res.dateValued,
                        req.id AS RequestID,
                        req.requestImage,
                        req.note,
                        req.createdDate,
                        req.appointmentDate,
                        dia.certificateId,
                        dia.proportions,
                        dia.diamondOrigin,
                        dia.caratWeight,
                        dia.measurements,
                        dia.polish,
                        dia.fluorescence,
                        dia.color,
                        dia.cut,
                        dia.clarity,
                        dia.symmetry,
                        dia.shape,
                        acc.firstName,
                        acc.lastName,
                        acc.email,
                        acc.phone,
                        pro.processStatus,
                        ser.serviceName,
                        ser.price AS servicePrice
                    FROM
                        Results res
                    JOIN
                        Requests req ON res.requestId = req.id
                    JOIN
                        Diamonds dia ON req.diamondId = dia.id
                    JOIN
                        Account acc ON req.userId = acc.id
                    JOIN
                        (
                            SELECT
                                rp.requestId,
                                MAX(COALESCE(rp.finishDate, rp.createdDate)) AS maxFinishDate -- Lấy finishDate hoặc nếu null thì lấy createdDate
                            FROM
                                RequestProcesses rp
                            GROUP BY
                                rp.requestId
                        ) rp_max ON req.id = rp_max.requestId
                    JOIN
                        RequestProcesses rp ON req.id = rp.requestId
                        AND (rp.finishDate = rp_max.maxFinishDate OR (rp.finishDate IS NULL AND rp.createdDate = rp_max.maxFinishDate))
                    JOIN
                        Processes pro ON rp.processId = pro.id
                    JOIN
                        Services ser ON req.serviceId = ser.id
                    ORDER BY
                        res.dateValued DESC;
            `);
            resolve(results.recordset);
        } catch (error) {
            reject(error);
        }
    });
};


const getRequestById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect(config);
            const request = await pool.request().input("id", sql.Int, id)
                .query(`
                    SELECT req.id AS RequestID, req.requestImage, req.note, req.createdDate, req.appointmentDate, req.paymentStatus,
                    ac.firstName, ac.lastName, ac.email, ac.phone,
                    dia.certificateId, dia.proportions, dia.diamondOrigin, dia.caratWeight, dia.measurements, dia.polish,
                    dia.fluorescence, dia.color, dia.cut, dia.clarity, dia.symmetry, dia.shape,
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
                    JOIN
                        Diamonds dia ON req.diamondId = dia.id
                    WHERE
                        req.id = @id;

                `);
            resolve(request.recordset[0]);
        } catch (error) {
            reject(error);
        }
    });
};

let countUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect(config);
            const count = await pool.request().query(`
            SELECT COUNT(id) AS count FROM Account;
        `);
            resolve(count.recordset[0].count);
        } catch (error) {
            reject(error);
        }
    });
}

let countDiamond = async (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect(config);
            const count = await pool.request().query(`
            SELECT COUNT(id) AS count FROM Diamonds;
        `);
            resolve(count.recordset[0].count);
        } catch (error) {
            reject(error)
        }
    });
}

let countRequest = async (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect(config);
            const count = await pool.request().query(`
            SELECT COUNT(id) AS count FROM Requests;
        `);
            resolve(count.recordset[0].count);
        } catch (error) {
            reject(error)
        }
    })
}

let getProfit = async (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect(config);
            const profit = await pool.request().query(`
            SELECT  SUM(ser.price) AS profit
            FROM
                Results res
            JOIN
                Requests req ON res.requestId = req.id
            JOIN
                Services ser ON req.serviceId = ser.id
        `);
            resolve(profit.recordset[0].profit);
        } catch (error) {
            reject(error)
        }
    })
}

const getAllServices = async () => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT id as serviceId, serviceName, description, price , status
            FROM Services
        `);

        return result.recordset;
    } catch (error) {
        console.error('Error in getAllServices service:', error);
        throw new Error('Error retrieving services');
    }
};

const createNewService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect(config);
            const request = pool.request();
            request.input('serviceName', sql.NVarChar, data.serviceName);
            request.input('price', sql.Int, data.price);
            request.input('description', sql.NVarChar, data.description);

            await request.query(`
                INSERT INTO Services (serviceName, price, description, status)
                VALUES (@serviceName, @price, @description, 1)
            `);

            resolve({
                errCode: 0,
                message: 'Service created successfully'
            });
        } catch (error) {
            reject(error);
        }
    });
};

const updateService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect(config);
            const request = pool.request();
            request.input('serviceId', sql.Int, data.serviceId);
            request.input('serviceName', sql.NVarChar, data.serviceName);
            request.input('description', sql.NVarChar, data.description);
            request.input('price', sql.Int, data.price);

            const result = await request.query(`
                UPDATE Services
                SET serviceName = @serviceName, price = @price, description = @description
                WHERE id = @serviceId
            `);

            if (result.rowsAffected[0] === 0) {
                return resolve({
                    errCode: 2,
                    message: 'Service not found'
                });
            }

            resolve({
                errCode: 0,
                message: 'Service updated successfully'
            });
        } catch (error) {
            reject(error);
        }
    });
};


const deleteService = (serviceId, status) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect(config);
            const request = pool.request();
            const result = await request
                .input('serviceId', sql.Int, serviceId)
                .input('status', sql.Int, status)
                .query(`
                UPDATE Services
                SET status = @status
                WHERE id = @serviceId
            `);

            if (result.rowsAffected[0] === 0) {
                return resolve({
                    errCode: 2,
                    message: 'Service not found'
                });
            }

            resolve({
                errCode: 0,
                message: 'Service deleted successfully'
            });

        } catch (error) {
            reject(error);
        }
    });
};

const getValuationStaffStatic = async () => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .query(`
                    SELECT
                        A.id AS StaffID,
                        A.firstName + ' ' + A.lastName AS StaffName,
                        COUNT(RP.id) AS TotalRequests,
                        SUM(CASE WHEN P.processStatus = 'Done' THEN 1 ELSE 0 END) AS CompletedRequests
                    FROM
                        Account A
                    LEFT JOIN
                        RequestProcesses RP ON A.id = RP.receiver
                    LEFT JOIN
                        Processes P ON RP.processId = P.id
                    LEFT JOIN
                        Account A2 ON A2.id = RP.sender
                    LEFT JOIN
                        Role R ON A.roleId = R.id
                    LEFT JOIN
                        Role R2 ON A2.roleId = R2.id
                    WHERE
                        R.name = 'Consulting Staff'
                        AND R2.name = 'Customer'
                    GROUP BY
                        A.id, A.firstName, A.lastName
                    ORDER BY
                        TotalRequests DESC;
                `);

        return result.recordset;
    } catch (error) {
        console.error('Error in getValuationStaffStatic:', error);
        throw new Error('Error retrieving valuation staff');
    }
}

const getConsultingStaffStatic = async () => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .query(`
                SELECT
                    A.id AS StaffID,
                    A.firstName + ' ' + A.lastName AS StaffName,
                    COUNT(RP.id) AS TotalRequests,
                    SUM(CASE WHEN RP.processId = P.id AND P.processStatus = 'Done' THEN 1 ELSE 0 END) AS CompletedRequests
                FROM
                    Account A
                LEFT JOIN
                    RequestProcesses RP ON A.id = RP.receiver
                LEFT JOIN
                    Processes P ON RP.processId = P.id
                LEFT JOIN
                    Role R ON A.roleId = R.id
                WHERE
                    R.name IN ('Consulting Staff')
                GROUP BY
                    A.id, A.firstName, A.lastName
                ORDER BY
                    TotalRequests DESC;
                `);

        return result.recordset;
    } catch (error) {
        console.error('Error in getConsultingStaffStatic:', error);
        throw new Error('Error retrieving consulting staff');
    }
}
module.exports = {
    checkUserName: checkUserName,
    getUserById: getUserById,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    hashUserPassword: hashUserPassword,
    updateUser: updateUser,
    deleteUser: deleteUser,
    getDiamonds: getDiamonds,
    getRequests: getRequests,
    getResults: getResults,
    countUser: countUser,
    countDiamond: countDiamond,
    getRequestById: getRequestById,
    countRequest: countRequest,
    getProfit: getProfit,
    getAllServices: getAllServices,
    createNewService: createNewService,
    updateService: updateService,
    deleteService: deleteService,
    getValuationStaffStatic: getValuationStaffStatic,
    getConsultingStaffStatic: getConsultingStaffStatic
}
