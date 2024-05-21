var express = require('express');
var userController = require('../controllers/userController');
var requestController = require('../controllers/requestController');
let router = express.Router();

let initWebRoutes = (app) => {
    router.post("/api/login", userController.handleLogin)
    router.post("/api/register", userController.handleRegister)


    return app.use("/", router);
};

module.exports = initWebRoutes;