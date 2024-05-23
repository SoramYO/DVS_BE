var express = require('express');
var userController = require('../controllers/userController');
var adminController = require('../controllers/adminController');
let router = express.Router();

let initWebRoutes = (app) => {
    router.post("/api/login", userController.handleLogin)
    router.post("/api/register", userController.handleRegister)
    router.get("/api/users/:id", adminController.handleGetUserById)
    router.get("/api/users", adminController.handleGetAllUsers)
    router.post("/api/createNewUser", adminController.handleCreateNewUser)
    router.put("/api/updateUser", adminController.handleUpdateUser)

    return app.use("/", router);
};

module.exports = initWebRoutes;