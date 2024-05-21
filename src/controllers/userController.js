var userService = require('../services/userService');

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
        user: userData.user ? userData.user : {}
    })
}
let handleRegister = async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;

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

module.exports = {
    handleLogin: handleLogin,
    handleRegister: handleRegister
}