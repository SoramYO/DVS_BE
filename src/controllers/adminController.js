var adminService = require('../services/adminService')

let handleGetAllUsers = async (req, res) => {
    let id = req.body.id;
    if (!id) {
        return res.status(400).json({
            errCode: 1,
            message: 'Missing required parameter!',
            users: []
        })
    }
    let users = await adminService.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        message: 'OK',
        users
    })
}

let handleCreateNewUser = async (req, res) => {
    let message = await adminService.createNewUser(req.body);
    return res.status(200).json(message)
}
let handleUpdateUser = async (req, res) => {
    let message = await adminService.updateUser(req.body);
    return res.status(200).json(message)
}
module.exports = {
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleUpdateUser: handleUpdateUser
}