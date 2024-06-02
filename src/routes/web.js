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
    router.get("/api/users/:id", verifyToken, adminController.handleGetUserById);
    router.get("/api/users", verifyToken, adminController.handleGetAllUsers);
    router.get("/api/countUser", verifyToken, adminController.handleCountUser);
    router.post("/api/users", verifyToken, adminController.handleCreateNewUser);
    router.put("/api/users", verifyToken, adminController.handleUpdateUser);
    router.put("/api/deleteUser", verifyToken, adminController.handleDeleteUser);
    router.get("/api/diamonds", verifyToken, adminController.handleGetDiamonds);
    router.get("/api/countDiamond", verifyToken, adminController.handleCountDiamond);
    router.get("/api/requests", verifyToken, adminController.handleGetRequests);
    router.get("/api/requests/:id", verifyToken, adminController.handleGetRequestById);
    router.get("/api/countRequest", verifyToken, adminController.handleCountRequest);
    router.get("/api/results", verifyToken, adminController.handleGetResults);
    router.get("/api/profit", verifyToken, adminController.handleGetProfit);

    router.get("/icon", (req, res) => {
        res.send('😀😃😄😁😆😅🤣😂');
    });

    return app.use("/", router);
};

module.exports = initWebRoutes;