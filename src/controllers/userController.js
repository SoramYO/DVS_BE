var userService = require('../services/userService');
require('dotenv').config();
const jwt = require('jsonwebtoken');
let handleLogin = async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    //check email exist
    if (!username || !password) {
        return res.status(400).json({
            errCode: 1,
            message: 'Missing INPUT PARAMETER! Please check again!'
        })
    }
    let userData = await userService.handleUserLogin(username, password);
    if (userData.errCode !== 0) {


        return res.status(400).json({
            errCode: userData.errCode,
            message: userData.errMessage,
            user: userData.user ? userData.user : {},
        })
    } else {
        const accessToken = jwt.sign({ id: userData.user.id, role: userData.user.role }, process.env.ACCESS_TOKEN_SECRET);
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        return res.status(200).json({
            errCode: userData.errCode,
            message: userData.errMessage,
            user: userData.user ? userData.user : {},
        })
    }
    //compare password
    //return user info
    //access_token:JWT (Json Web Token)

}
let handleRegister = async (req, res) => {
    let { username, password, firstName, lastName } = req.body;
    if (!username || !password || !firstName || !lastName) {
        return res.status(400).json({
            errCode: 1,
            message: 'Missing INPUT PARAMETER! Please check again!'
        })
    }
    let message = await userService.handleUserRegister(username, password, firstName, lastName);
    if (message.errCode !== 0) {
        return res.status(400).json(message)
    } else {
        return res.status(200).json(message)
    }
}

let handleCreateNewRequest = async (req, res) => {
    let data = req.body;
    let message = await userService.createNewRequest(data);
    return res.status(200).json(message)
}



module.exports = {
    handleLogin: handleLogin,
    handleRegister: handleRegister,
    handleCreateNewRequest: handleCreateNewRequest
}