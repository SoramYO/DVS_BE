const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userController = require('../controllers/userController'); // Đảm bảo đường dẫn này là chính xác
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.post('/login', userController.handleLogin);
app.post('/register', userController.handleRegister);

module.exports = app;