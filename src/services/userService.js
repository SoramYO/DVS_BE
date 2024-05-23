var bcrypt = require('bcryptjs');
var { connectDB, sql } = require('../config/connectDb');
const salt = bcrypt.genSaltSync(10);
var config = require('../config/dbconfig');
const e = require('express');



let handleUserLogin = (username, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            var pool = await connectDB;
            let isExist = await checkUserName(username);
            if (isExist) {
                let user = await pool.request()
                    .query("SELECT username, password, firstName, lastName, email, phone, createdAt, status, name as role FROM Account as ac JOIN Role as r ON ac.roleId = r.id WHERE username = '" + username + "'");
                userData = user.recordset[0];
                if (user.recordset.length > 0) {
                    //compare password
                    let check = await bcrypt.compareSync(password, userData.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'OK';
                        const { password, errCode, errMessage, ...userWithoutPassword } = user.recordset[0];
                        userData.user = userWithoutPassword;
                    } else {
                        userData.errCode = 1;
                        userData.errMessage = 'Wrong password';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = 'User not found';
                }
            } else {
                userData.errCode = 3;
                userData.errMessage = 'Email not exist or password';
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
            var pool = await connectDB;
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

let handleUserRegister = (username, password, firstName, lastName) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await connectDB;
            const hashedPassword = await bcrypt.hash(password, 10); // Hash the password using bcrypt

            const request = pool.request();
            request.input('username', sql.NVarChar, username);
            request.input('password', sql.NVarChar, hashedPassword);
            request.input('firstName', sql.NVarChar, firstName);
            request.input('lastName', sql.NVarChar, lastName);
            request.input('roleId', sql.Int, 1);
            request.input('status', sql.Int, 1);
            request.input('createdAt', sql.DateTime, new Date());

            const result = await request.query(`
        INSERT INTO Account (username, password, firstName, lastName, roleId, status, createdAt)
        VALUES (@username, @password, @firstName, @lastName, @roleId, @status, @createdAt)
        `);

            resolve({ errCode: 0, message: 'Register success' });
        } catch (error) {
            let isExist = await checkUserName(email);
            if (isExist) {
                resolve({ errCode: 1, message: 'Email exist try another email!' });
            } else {
                reject(error);
            }
        }
    });
};

let compareUserPassword = (password, user) => {
    return new Promise(async (resolve, reject) => {
        try {

            let same = await bcrypt.compare(password, user.password);
            if (same) {
                resolve(user);
            } else {
                resolve(null);
            }
        } catch (error) {
            reject(error);
        }
    })
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
//query to create new request
// -- Step 1: Insert into Diamond
// DECLARE @NewDiamondID INT;

// INSERT INTO Diamond (proportions, diamondOrigin, caratWeight, measurements, polish, flourescence, color, cut, clarity, symmetry, shape)
// OUTPUT INSERTED.id INTO @NewDiamondID
// VALUES (N'proportions_value', N'diamondOrigin_value', caratWeight_value, N'measurements_value', N'polish_value', N'flourescence_value', N'color_value', N'cut_value', N'clarity_value', N'symmetry_value', N'shape_value');

// -- Step 2: Insert into Request using the new Diamond ID
// INSERT INTO Request (requestImage, note, createdDate, updatedDate, userId, processId, diamondId)
// VALUES (N'requestImage_value', N'note_value', GETDATE(), GETDATE(), userId_value, processId_value, @NewDiamondID);

let createNewRequest = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await connectDB;
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
            request.input('processId', sql.Int, data.processId);

            const result = await request.query(`
                DECLARE @NewDiamondID TABLE (id INT);

                INSERT INTO Diamond (proportions, diamondOrigin, caratWeight, measurements, polish, flourescence, color, cut, clarity, symmetry, shape)
                OUTPUT INSERTED.id INTO @NewDiamondID
                VALUES (@proportions, @diamondOrigin, @caratWeight, @measurements, @polish, @flourescence, @color, @cut, @clarity, @symmetry, @shape);

                INSERT INTO Request (requestImage, note, createdDate, updatedDate, userId, processId, diamondId)
                VALUES (@requestImage, @note, GETDATE(), GETDATE(), @userId, @processId, (SELECT id FROM @NewDiamondID));
            `);

            resolve({ errCode: 0, message: 'Create new request success' });
        } catch (error) {
            reject(error);
        }
    });
};


module.exports = {
    handleUserLogin: handleUserLogin,
    checkUserName: checkUserName,
    handleUserRegister: handleUserRegister,
    hashUserPassword: hashUserPassword,
    createNewRequest: createNewRequest
}
