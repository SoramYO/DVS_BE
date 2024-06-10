var userService = require("../services/userService");
require("dotenv").config();
const jwt = require("jsonwebtoken");

let handleLogin = async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  //check email exist
  if (!username || !password) {
    return res.status(400).json({
      errCode: 1,
      message: "Missing INPUT PARAMETER! Please check again!",
    });
  }
  let userData = await userService.handleUserLogin(username, password);
  if (userData.errCode !== 0) {
    return res.status(400).json({
      errCode: userData.errCode,
      message: userData.errMessage,
      user: userData.user ? userData.user : {},
    });
  } else {
    const accessToken = jwt.sign(
      { id: userData.user.id, role: userData.user.role },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      path: "/",
      sameSite: "none",
      secure: true,
    });
    return res.status(200).json({
      errCode: userData.errCode,
      message: userData.errMessage,
      user: userData.user ? userData.user : {},
      accessToken: accessToken,
    });
  }
};

let handleRegister = async (req, res) => {
  let { username, password, firstName, lastName, email, phone } = req.body;
  if (!username || !password || !firstName || !lastName || !email || !phone) {
    return res.status(400).json({
      errCode: 1,
      message: "Missing INPUT PARAMETER! Please check again!",
    });
  }
  let message = await userService.handleUserRegister(
    username,
    password,
    firstName,
    lastName,
    email,
    phone
  );
  if (message.errCode !== 0) {
    return res.status(400).json(message);
  } else {
    return res.status(200).json(message);
  }
};

let handleForgotPassword = async (req, res) => {
  let email = req.body.email;
  if (!email) {
    return res.status(400).json({
      errCode: 1,
      message: "Missing INPUT PARAMETER! Please check again!",
    });
  }
  let message = await userService.forgotPassword(email);
  return res.status(200).json(message);
}

let handleCreateNewRequest = async (req, res) => {
  let data = req.body;
  let message = await userService.createNewRequest(data);
  return res.status(200).json(message);
};
let handlePayment = async (req, res) => {
  let message = await userService.payment(req.body, req.params);
  return res.status(200).json(message);
}
let handleCompletePayment = async (req, res) => {
  let message = await userService.completePayment(req.params);
  return res.status(200).json(message);
}
let handleVerifyEmail = async (req, res) => {
  let message = await userService.verifyToken(req.query);
  return res.status(200).json(message);
}
let handleResetPassword = async (req, res) => {
  let message = await userService.resetPassword(req.body);
  return res.status(200).json(message);
}
let handleRegisterMail = async (req, res) => {
  let message = await userService.sendSubscriptionEmail(req.body);
  return res.status(200).json(message);
}
let handleCreatePaymentUrl = async (req, res) => {
  let message = await userService.createPaymentUrl(req);
  return res.status(200).json(message);
}
let handleVnPayReturn = async (req, res) => {
  let message = await userService.vnPayReturn(req);
  return res.status(200).json(message);
}

let handleVnPayIPN = async (req, res) => {
  let message = await userService.vnPayIPN(req);
  return res.status(200).json(message);
}

let handleQueryDR = async (req, res) => {
  let message = await userService.queryDR(req.body);
  return res.status(200).json(message);
}

let handleRefund = async (req, res) => {
  let message = await userService.refund(req.body);
  return res.status(200).json(message);
}

module.exports = {
  handleLogin: handleLogin,
  handleRegister: handleRegister,
  handleForgotPassword: handleForgotPassword,
  handleVerifyEmail: handleVerifyEmail,
  handleResetPassword: handleResetPassword,
  handleCreateNewRequest: handleCreateNewRequest,
  handlePayment: handlePayment,
  handleCompletePayment: handleCompletePayment,
  handleRegisterMail: handleRegisterMail,
  handleCreatePaymentUrl: handleCreatePaymentUrl,
  handleVnPayReturn: handleVnPayReturn,
  handleVnPayIPN: handleVnPayIPN,
  handleQueryDR: handleQueryDR,
  handleRefund: handleRefund,
};
