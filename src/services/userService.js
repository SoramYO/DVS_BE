const sql = require("mssql");
var bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
require('dotenv').config();
const jwt = require('jsonwebtoken');
var config = require('../config/dbconfig');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


let handleUserLogin = (username, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            const pool = await sql.connect(config);
            let isExist = await checkUserName(username);
            if (isExist) {
                let user = await pool.request()
                    .input('username', sql.NVarChar, username)

                    .query("SELECT ac.id, password, firstName, lastName, status, r.name as role FROM Account as ac JOIN Role as r ON ac.roleId = r.id WHERE username = @username");

                userData = user.recordset[0];
                if (user.recordset.length > 0) {
                    //compare password
                    let check = await bcrypt.compareSync(password, userData.password);
                    if (userData.status === 1) {
                        if (check) {
                            userData.errCode = 0;
                            userData.errMessage = 'OK';

                            const { password, status, errCode, errMessage, ...userWithoutPassword } = user.recordset[0];

                            userData.user = userWithoutPassword;
                        } else {
                            userData.errCode = 1;
                            userData.errMessage = 'Username or password is incorrect';
                        }
                    } else {
                        userData.errCode = 4;
                        userData.errMessage = 'Account has been locked';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = 'User not found';
                }
            } else {
                userData.errCode = 3;
                userData.errMessage = 'Username or password is incorrect';
            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    });
};

let checkUserName = (username) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect(config);
            let user = await pool.request()
                .input('username', sql.NVarChar, username)
                .query("SELECT username FROM Account WHERE username = @username");
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

let handleUserRegister = (username, password, firstName, lastName, email, phone) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isExist = await checkUserName(username);
            if (isExist) {
                resolve({ errCode: 1, message: 'Username exist try another username!' });
            } else if (!password || password.length < 6) {
                resolve({
                    errCode: 3,
                    message: 'Password must be at least 6 characters long.'
                });
            } else {
                const pool = await sql.connect(config);
                const hashedPassword = await bcrypt.hash(password, 10); // Hash the password using bcrypt

                const request = pool.request();
                request.input('username', sql.NVarChar, username);
                request.input('password', sql.NVarChar, hashedPassword);
                request.input('firstName', sql.NVarChar, firstName);
                request.input('lastName', sql.NVarChar, lastName);
                request.input('email', sql.NVarChar, email);
                request.input('phone', sql.NVarChar, phone);
                request.input('roleId', sql.Int, 1);
                request.input('status', sql.Int, 1);
                request.input('createdAt', sql.DateTime, new Date());

                const result = await request.query(`
        INSERT INTO Account (username, password, firstName, lastName, email, phone, roleId, status, createdAt)
        VALUES (@username, @password, @firstName, @lastName, @email, @phone, @roleId, @status, @createdAt)
        `);

                resolve({ errCode: 0, message: 'Register success' });
            }
        } catch (error) {
            reject(error);
        }
    });
};

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

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

const generateToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

const forgotPassword = async (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect(config);
            const request = pool.request();
            request.input('email', sql.NVarChar, email)
            const result = await request.query('SELECT id FROM Account WHERE email = @email');
            if (result.recordset.length === 0) {
                resolve({ errCode: 2, message: 'Email not found' });
            }

            const token = generateToken();
            const userId = result.recordset[0].id;

            await request.input('userId', sql.Int, userId)
                .input('token', sql.NVarChar, token)
                .input('expiryDate', sql.DateTime, new Date(Date.now() + 3600000))
                .query('INSERT INTO PasswordResetTokens (userId, token, expiryDate) VALUES (@userId, @token, @expiryDate)');

            const resetLink = `https://dvs-fe-soramyos-projects.vercel.app/reset-password?token=${token}&id=${userId}`;
            await transporter.sendMail({
                from: '> Diamond Valuation System <',
                to: email,
                subject: 'Password Reset',
                html: `Click <a href="${resetLink}">here</a> to reset your password
                Bá ếch gà vcl gà điên`
            });

            resolve({ errCode: 0, message: 'Email sent successfully' });
        } catch (error) {
            rejects({ errCode: 1, message: 'Server error', error });
        }
    });
};

const verifyToken = async (query) => {
    return new Promise(async (resolve, reject) => {
        const { token, id } = query;
        try {
            const pool = await sql.connect(config);
            const request = pool.request();

            const result = await request.input('token', sql.NVarChar, token)
                .input('userId', sql.Int, id)
                .query('SELECT * FROM PasswordResetTokens WHERE token = @token AND userId = @userId AND expiryDate > GETDATE()');

            if (result.recordset.length === 0) {
                resolve({ errCode: 2, message: 'Invalid or expired token' });
            }

            resolve({ errCode: 0, message: 'Token is valid' });
        } catch (error) {
            reject({ errCode: 1, message: 'Server error', error });
        }
    });
};

let resetPassword = async (body) => {
    return new Promise(async (resolve, reject) => {
        const { userId, token, password } = body;
        try {
            const pool = await sql.connect(config);

            // Kiểm tra token
            const checkTokenRequest = pool.request();
            const result = await checkTokenRequest
                .input('token', sql.NVarChar, token)
                .input('userId', sql.Int, userId)
                .query('SELECT * FROM PasswordResetTokens WHERE token = @token AND userId = @userId AND expiryDate > GETDATE()');

            if (result.recordset.length === 0) {
                return resolve({ errCode: 2, message: 'Invalid or expired token' });
            }
            //Hash mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10);
            //Cập nhật mật khẩu
            const updatePasswordRequest = pool.request();
            await updatePasswordRequest
                .input('userId', sql.Int, userId)
                .input('password', sql.NVarChar, hashedPassword)
                .query('UPDATE Account SET password = @password WHERE id = @userId');
            //Xóa token
            const deleteTokenRequest = pool.request();
            await deleteTokenRequest
                .input('userId', sql.Int, userId)
                .query('DELETE FROM PasswordResetTokens WHERE userId = @userId');

            resolve({ errCode: 0, message: 'Password reset successfully' });
        } catch (error) {
            reject({ errCode: 1, message: 'Server error', error });
        }
    });
};

let createNewRequest = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect(config);
            const request = pool.request();
            request.input('proportions', sql.NVarChar, data.proportions);
            request.input('diamondOrigin', sql.NVarChar, data.diamondOrigin);
            request.input('caratWeight', sql.Float, data.caratWeight);
            request.input('measurements', sql.NVarChar, data.measurements);
            request.input('polish', sql.NVarChar, data.polish);
            request.input('flourescence', sql.NVarChar, data.flourescence);
            request.input('color', sql.NVarChar, data.color);
            request.input('cut', sql.NVarChar, data.cut);
            request.input('clarity', sql.NVarChar, data.clarity);
            request.input('symmetry', sql.NVarChar, data.symmetry);
            request.input('shape', sql.NVarChar, data.shape);
            request.input('requestImage', sql.NVarChar, data.requestImage);
            request.input('note', sql.NVarChar, data.note);
            request.input('userId', sql.Int, data.userId);
            request.input('processId', sql.Int, 1);
            request.input('serviceId', sql.Int, data.serviceId);

            const result = await request.query(`
                DECLARE @NewDiamondID TABLE (id INT);

                INSERT INTO Diamond (proportions, diamondOrigin, caratWeight, measurements, polish, flourescence, color, cut, clarity, symmetry, shape)
                OUTPUT INSERTED.id INTO @NewDiamondID
                VALUES (@proportions, @diamondOrigin, @caratWeight, @measurements, @polish, @flourescence, @color, @cut, @clarity, @symmetry, @shape);


                INSERT INTO Request (requestImage, note, createdDate, updatedDate, userId, processId, diamondId,serviceId , paymentStatus)
                VALUES (@requestImage, @note, GETDATE(), GETDATE(), @userId, @processId, (SELECT id FROM @NewDiamondID) , @serviceId, 'Unpaid');

                INSERT INTO Payment (requestId, paymentAmount, paymentDate)
                VALUES (SCOPE_IDENTITY(), 0, GETDATE());
            `);

            resolve({ errCode: 0, message: 'Create new request success' });
        } catch (error) {
            reject(error);
        }
    });
};

let payment = (body, params) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect(config);
            const request = pool.request();
            request.input('requestId', sql.Int, params.id);
            request.input('paymentAmount', sql.Int, body.paymentAmount);
            let paymentStatus = 'Unpaid';
            let servicePrice = await pool.request()
                .input('requestId', sql.Int, params.id)
                .query(`SELECT s.price FROM Request r JOIN Service s ON r.serviceId = s.id WHERE r.id = @requestId`);
            if (body.paymentAmount === 0) {
                paymentStatus = 'Unpaid';
            }
            else if (body.paymentAmount === servicePrice.recordset[0].price) {
                paymentStatus = 'Full Payment';
            }
            else if (body.paymentAmount === servicePrice.recordset[0].price * 0.2) {
                paymentStatus = 'Partially Paid';
            }
            request.input('paymentStatus', sql.NVarChar, paymentStatus);
            request.input('paymentDate', sql.DateTime, new Date());
            await request.query(`
                UPDATE Payment
                SET paymentAmount = @paymentAmount, paymentDate = @paymentDate
                WHERE requestId = @requestId;

                UPDATE Request
                SET paymentStatus = @paymentStatus
                WHERE id = @requestId;
            `);
            resolve({ errCode: 0, message: 'Payment success' });
        } catch (error) {
            reject(error);
        }
    });
}

let completePayment = async (params) => {
    try {
        const pool = await sql.connect(config);
        const request = pool.request();

        const serviceInfo = await request
            .input('requestId', sql.Int, params.id)
            .query(`SELECT s.price, p.paymentAmount FROM Request r JOIN Service s ON r.serviceId = s.id LEFT JOIN Payment p ON r.id = p.requestId WHERE r.id = @requestId`);

        const servicePrice = serviceInfo.recordset[0].price;
        const paidAmount = serviceInfo.recordset[0].paymentAmount || 0;
        const remainingAmount = servicePrice - paidAmount;
        const fullPayment = remainingAmount + paidAmount;

        await request
            .input('paymentAmount', sql.Int, fullPayment)
            .input('paymentDate', sql.DateTime, new Date())
            .query(`
                UPDATE Payment
                SET paymentAmount = @paymentAmount, paymentDate = @paymentDate
                WHERE requestId = @requestId;
            `);

        let paymentStatus = remainingAmount === 0 ? 'Full Payment' : 'Partially Paid';
        await request
            .input('paymentStatus', sql.NVarChar, paymentStatus)
            .query(`
                UPDATE Request
                SET paymentStatus = @paymentStatus
                WHERE id = @requestId;
            `);

        return { errCode: 0, message: 'Payment completed successfully' };
    } catch (error) {
        throw error;
    }
};




module.exports = {
    handleUserLogin: handleUserLogin,
    checkUserName: checkUserName,
    forgotPassword: forgotPassword,
    verifyToken: verifyToken,
    resetPassword: resetPassword,
    handleUserRegister: handleUserRegister,
    hashUserPassword: hashUserPassword,
    createNewRequest: createNewRequest,
    payment: payment,
    completePayment: completePayment
}
