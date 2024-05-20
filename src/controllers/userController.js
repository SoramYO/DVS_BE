var userService = require('../services/userService');

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    //check email exist
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing INPUT PARAMETER! Please check again!'
        })
    }
    let userData = await userService.handleUserLogin(email, password);
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
    let email = req.body.email;
    let password = req.body.password;
    let fullName = req.body.fullName;
    let phone = req.body.phone;
    let address = req.body.address;
    //check email exist
    if (!email || !password || !fullName) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing INPUT PARAMETER! Please check again!'
        })
    }
    let message = await userService.handleUserRegister(email, password, fullName, phone, address);
    return res.status(200).json(message)
}

module.exports = {
    handleLogin: handleLogin,
    handleRegister: handleRegister
}