var bcrypt = require('bcryptjs');
var { connectDB, sql } = require('../config/connectDb');
const salt = bcrypt.genSaltSync(10);
var config = require('../config/dbconfig');
const e = require('express');

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

let getAllUsers = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            var pool = await connectDB;
            let users = '';
            if (id === 'ALL') {
                users = await pool.request().query("SELECT username, firstName, lastName, email, phone, createdAt, status, name as role FROM Account as ac JOIN Role as r ON ac.roleId = r.id");
            }
            if (id !== 'ALL') {
                users = await pool.request().query("SELECT username, firstName, lastName, email, phone, createdAt, status, name as role FROM Account as ac JOIN Role as r ON ac.roleId = r.id WHERE ac.id = " + id);
            }
            resolve(users.recordset);
            console.log(users.recordset);
        } catch (error) {
            reject(error);
        }
    });
}
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
                const pool = await connectDB;
                const hashedPassword = await hashUserPassword(data.password)
                const request = pool.request();
                request.input('username', sql.NVarChar, data.username);
                request.input('password', sql.NVarChar, hashedPassword);
                request.input('firstName', sql.NVarChar, data.firstName);
                request.input('lastName', sql.NVarChar, data.lastName);
                request.input('email', sql.NVarChar, data.email);
                request.input('phone', sql.NVarChar, data.phone);
                request.input('createdAt', sql.DateTime, new Date());
                request.input('status', sql.Int, data.status);
                request.input('roleId', sql.Int, data.roleId);

                await request.query(`
        INSERT INTO Account (username, password, firstName, lastName, email, phone, createdAt, status, roleId)
        VALUES (@username, @password, @firstName, @lastName, @email, @phone, @createdAt, @status, @roleId)
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

            const pool = await connectDB;
            const hashedPassword = await hashUserPassword(data.password)
            const request = pool.request();
            let users = await pool.request().query("SELECT username, firstName, lastName, email, phone, createdAt, status, name as role FROM Account as ac JOIN Role as r ON ac.roleId = r.id WHERE ac.id = " + data.id);
            if (users.recordset.length > 0) {
                if (users.recordset.password !== data.password) {
                    request.input('password', sql.NVarChar, hashedPassword);
                } else {
                    const hashedOldPassword = await hashUserPassword(users.recordset.password)
                    request.input('password', sql.NVarChar, hashedOldPassword);
                }
                if (users.recordset.firstName !== data.firstName) {
                    request.input('firstName', sql.NVarChar, data.firstName);
                } else {
                    request.input('firstName', sql.NVarChar, users.recordset.firstName);
                }
                if (users.recordset.lastName !== data.lastName) {
                    request.input('lastName', sql.NVarChar, data.lastName);
                } else {
                    request.input('lastName', sql.NVarChar, users.recordset.lastName);
                }
                if (users.recordset.email !== data.email) {
                    request.input('email', sql.NVarChar, data.email);
                } else {
                    request.input('email', sql.NVarChar, users.recordset.email);
                }
                if (users.recordset.phone !== data.phone) {
                    request.input('phone', sql.NVarChar, data.phone);
                } else {
                    request.input('phone', sql.NVarChar, users.recordset.phone);
                }
                if (users.recordset.status !== data.status) {
                    request.input('status', sql.Int, data.status);
                } else {
                    request.input('status', sql.Int, users.recordset.status);
                }
                if (users.recordset.role !== data.role) {
                    request.input('roleId', sql.Int, data.roleId);
                } else {
                    request.input('roleId', sql.Int, users.recordset.roleId);
                }

                await request.query(`
        UPDATE Account SET password = @password, firstName = @firstName, lastName = @lastName, email = @email, phone = @phone, status = @status, roleId = @roleId
        WHERE id = ${data.id}
        `);
                resolve({
                    errCode: 0,
                    message: 'Update user success'
                });
            } else {
                resolve({
                    errCode: 1,
                    message: 'User not found'
                });
            }
        } catch (error) {
            reject(error);
        }
    });
}



module.exports = {
    checkUserName: checkUserName,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    hashUserPassword: hashUserPassword,
    updateUser: updateUser
}
