var bcrypt = require('bcryptjs');
var { connectDB, sql } = require('../config/connectDb');
const salt = bcrypt.genSaltSync(10);
var config = require('../config/dbconfig');
const e = require('express');
var Account = require('../models/Account');
const connectMdb = require('../config/connectMdb');

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
let getUserById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await connectDB;
            const user = await pool.request().query(`
          SELECT username, firstName, lastName, email, phone, createdAt, status, name as role
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
            const pool = await connectDB;
            const users = await pool.request().query(`
          SELECT username, firstName, lastName, email, phone, createdAt, status, name as role
          FROM Account as ac
          JOIN Role as r ON ac.roleId = r.id
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
                    message: 'Email exist try another email!'
                });
            } else {
                const user = await Account.create(data)
                if (!user) {
                    return reject({
                        errCode: 1,
                        message: 'Create new user failed'
                    });
                }


                //         const pool = await connectDB;
                //         const hashedPassword = await hashUserPassword(data.password)
                //         const request = pool.request();
                //         request.input('username', sql.NVarChar, data.username);
                //         request.input('password', sql.NVarChar, hashedPassword);
                //         request.input('firstName', sql.NVarChar, data.firstName);
                //         request.input('lastName', sql.NVarChar, data.lastName);
                //         request.input('email', sql.NVarChar, data.email);
                //         request.input('phone', sql.NVarChar, data.phone);
                //         request.input('createdAt', sql.DateTime, new Date());
                //         request.input('status', sql.Int, data.status);
                //         request.input('roleId', sql.Int, data.roleId);

                //         await request.query(`
                // INSERT INTO Account (username, password, firstName, lastName, email, phone, createdAt, status, roleId)
                // VALUES (@username, @password, @firstName, @lastName, @email, @phone, @createdAt, @status, @roleId)
                // `);

                //         resolve({
                //             errCode: 0,
                //             message: 'Create new user success'
                //         });
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
            const pool = await connectDB;
            const hashedPassword = data.password ? await hashUserPassword(data.password) : null;

            // Truy xuất dữ liệu hiện tại của người dùng
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

            // Kết hợp dữ liệu mới với dữ liệu hiện tại
            const updatedData = {
                password: hashedPassword || currentUser.password,
                firstName: data.firstName || currentUser.firstName,
                lastName: data.lastName || currentUser.lastName,
                email: data.email || currentUser.email,
                phone: data.phone || currentUser.phone,
                status: data.status !== undefined ? data.status : currentUser.status,
                roleId: data.roleId || currentUser.roleId
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




module.exports = {
    checkUserName: checkUserName,
    getUserById: getUserById,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    hashUserPassword: hashUserPassword,
    updateUser: updateUser
}
