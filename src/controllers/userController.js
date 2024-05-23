var userService = require('../services/userService');
require('dotenv').config();

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
    //compare password
    //return user info
    //access_token:JWT (Json Web Token)
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {},
        accessToken: userData.accessToken
    })
}
let handleRegister = async (req, res) => {
    let { username, password, firstName, lastName } = req.body;

    //check email exist
    if (!username || !password || !firstName || !lastName) {
        return res.status(400).json({
            errCode: 1,
            message: 'Missing INPUT PARAMETER! Please check again!'
        })
    }
    let message = await userService.handleUserRegister(username, password, firstName, lastName);
    return res.status(200).json(message)
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