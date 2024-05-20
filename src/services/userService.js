var bcrypt = require('bcryptjs');
var { connectDB, sql } = require('../config/connectDb');
const salt = bcrypt.genSaltSync(10);
var config = require('../config/dbconfig');
const e = require('express');





let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            var pool = await connectDB;
            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await pool.request().query("SELECT * FROM tblUser WHERE email = '" + email + "'");
                userData = user.recordset[0];
                if (user.recordset.length > 0) {
                    //compare password
                    let check = await bcrypt.compareSync(password, userData.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'OK';
                        const { password, ...userWithoutPassword } = user.recordset[0];
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


let checkUserEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            var pool = await connectDB;
            let user = await pool.request().query("SELECT * FROM tblUser WHERE email = '" + email + "'");
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

let handleUserRegister = (email, password, fullName, phone, address) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await connectDB;
            const hashedPassword = await bcrypt.hash(password, 10); // Hash the password using bcrypt

            const request = pool.request();
            request.input('email', sql.VarChar, email);
            request.input('password', sql.VarChar, hashedPassword);
            request.input('fullName', sql.VarChar, fullName);
            request.input('phone', sql.Int, phone);
            request.input('address', sql.VarChar, address);

            const result = await request.query(`
        INSERT INTO tblUser (email, password, fullName, phone, address)
        VALUES (@email, @password, @fullName, @phone, @address);
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
