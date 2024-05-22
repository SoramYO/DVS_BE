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
let handleGetAllUsers = async (req, res) => {
    let id = req.body.id;
    if (!id) {
        return res.status(400).json({
            errCode: 1,
            message: 'Missing required parameter!',
            users: []
        })
    }
    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        message: 'OK',
        users
    })
}

let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body);
    return res.status(200).json(message)
}

module.exports = {
    handleLogin: handleLogin,
    handleRegister: handleRegister,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser
}