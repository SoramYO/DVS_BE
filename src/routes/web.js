var express = require('express');
var userController = require('../controllers/userController');
var adminController = require('../controllers/adminController');
var staffController = require('../controllers/staffController');
var verifyToken = require('../middleware/auth');
let router = express.Router();

let initWebRoutes = (app) => {
    //user api
    router.post("/api/login", userController.handleLogin)
    router.post("/api/register", userController.handleRegister)
    router.post("/api/createNewRequest", verifyToken, userController.handleCreateNewRequest);

    //staff api
    router.post("/api/confirmRequest", verifyToken, staffController.handleConfirmRequest);

    //admin api
    router.get("/api/users/:id", verifyToken, adminController.handleGetUserById);
    router.get("/api/users", verifyToken, adminController.handleGetAllUsers);
    router.post("/api/createNewUser", verifyToken, adminController.handleCreateNewUser);
    router.put("/api/updateUser", verifyToken, adminController.handleUpdateUser);
    router.put("/api/deleteUser", verifyToken, adminController.handleDeleteUser);
    router.get("/api/diamonds", verifyToken, adminController.handleGetDiamonds);
    router.get("/api/requests", verifyToken, adminController.handleGetRequests);
    router.get("/api/results", verifyToken, adminController.handleGetResults);

    return app.use("/", router);
};

module.exports = initWebRoutes;