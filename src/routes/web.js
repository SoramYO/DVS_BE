var express = require('express');
var userController = require('../controllers/userController');
var adminController = require('../controllers/adminController');
var staffController = require('../controllers/staffController');
var { verifyToken, verifyAdmin } = require('../middleware/auth');
let router = express.Router();

let initWebRoutes = (app) => {
    //user api
    router.post("/api/login", userController.handleLogin)
    router.post("/api/register", userController.handleRegister)
    router.post("/api/createNewRequest", verifyToken, userController.handleCreateNewRequest);

    //staff api
    router.put("/api/confirmRequest", verifyToken, staffController.handleConfirmRequest);

    //admin api
    router.get("/api/users/:id", verifyAdmin, adminController.handleGetUserById);
    router.get("/api/users", verifyAdmin, adminController.handleGetAllUsers);
    router.post("/api/createNewUser", verifyAdmin, adminController.handleCreateNewUser);
    router.put("/api/updateUser", verifyAdmin, adminController.handleUpdateUser);
    router.put("/api/deleteUser", verifyAdmin, adminController.handleDeleteUser);
    router.get("/api/diamonds", verifyAdmin, adminController.handleGetDiamonds);
    router.get("/api/requests", verifyAdmin, adminController.handleGetRequests);
    router.get("/api/requests/:id", verifyAdmin, adminController.handleGetRequestById);
    router.get("/api/results", verifyAdmin, adminController.handleGetResults);

    return app.use("/", router);
};

module.exports = initWebRoutes;