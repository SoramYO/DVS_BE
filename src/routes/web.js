var express = require('express');
var userController = require('../controllers/userController');
var adminController = require('../controllers/adminController');
var staffController = require('../controllers/staffController');
var { verifyToken, verifyAdmin, verifyStaff } = require('../middleware/auth');
let router = express.Router();

let initWebRoutes = (app) => {
    //user api
    router.post("/api/login", userController.handleLogin)
    router.post("/api/register", userController.handleRegister)
    router.post("/api/createNewRequest", verifyToken, userController.handleCreateNewRequest);

    //staff api
    router.put("/api/changeProcess/:id", verifyToken, staffController.handleChangeProcess);
    router.put("/api/valuation/:id", verifyToken, staffController.handleValuation);

    //admin api
    router.get("/api/users/:id", verifyAdmin, adminController.handleGetUserById);
    router.get("/api/users", verifyAdmin, adminController.handleGetAllUsers);
    router.get("/api/countUser", verifyAdmin, adminController.handleCountUser);
    router.post("/api/users", verifyAdmin, adminController.handleCreateNewUser);
    router.put("/api/users", verifyAdmin, adminController.handleUpdateUser);
    router.put("/api/deleteUser", verifyAdmin, adminController.handleDeleteUser);
    router.get("/api/diamonds", adminController.handleGetDiamonds);
    router.get("/api/countDiamond", verifyAdmin, adminController.handleCountDiamond);
    router.get("/api/requests", adminController.handleGetRequests);
    router.get("/api/requests/:id", adminController.handleGetRequestById);
    router.get("/api/countRequest", adminController.handleCountRequest);
    router.get("/api/results", adminController.handleGetResults);
    router.get("/api/profit", verifyAdmin, adminController.handleGetProfit);

    return app.use("/", router);
};

module.exports = initWebRoutes;