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
            let isExist = await checkUserEmail(username);
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


let checkUserEmail = (username) => {
    return new Promise(async (resolve, reject) => {
        try {
            var pool = await connectDB;
            let user = await pool.request().query("SELECT * FROM Account WHERE username = '" + username + "'");
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
            let isExist = await checkUserEmail(email);
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

module.exports = {
    handleUserLogin: handleUserLogin,
    checkUserEmail: checkUserEmail,
    handleUserRegister: handleUserRegister
}
