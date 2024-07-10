var userService = require("../services/userService");
require("dotenv").config();
const jwt = require("jsonwebtoken");

let handleLogin = async (req, res) => {
  let usernameOrEmail = req.body.username;
  let password = req.body.password;

  // Check if username or email and password are provided
  if (!usernameOrEmail || !password) {
    return res.status(400).json({
      errCode: 1,
      message: "Missing INPUT PARAMETER! Please check again!",
    });
  }

  try {
    let userData = await userService.handleUserLogin(usernameOrEmail, password);

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
  } catch (error) {
    console.error("Error in handleLogin:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Server error",
      error: error.message,
    });
  }
};

let handleRegister = async (req, res) => {
  let { username, password, firstName, lastName, email, phone } = req.body;

  // Check if any required field is missing
  if (!username || !password || !firstName || !lastName || !email || !phone) {
    return res.status(400).json({
      errCode: 1,
      message: "Missing INPUT PARAMETER! Please check again!",
    });
  }

  try {
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
  } catch (error) {
    console.error("Error in handleRegister:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Server error",
      error: error.message,
    });
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

let getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const userProfile = await userService.getUserProfile(userId);

    if (!userProfile) {
      return res.status(404).json({
        errCode: 404,
        message: 'User profile not found'
      });
    }

    return res.status(200).json({
      errCode: 0,
      message: 'OK',
      userProfile
    });
  } catch (error) {
    console.error('Error in getProfile:', error);
    return res.status(500).json({
      errCode: 500,
      message: 'Server error',
      error: error.message
    });
  }
};

let updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, email, phone } = req.body;

    const result = await userService.updateProfile(userId, firstName, lastName, email, phone);

    if (result.errCode !== 0) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in updateProfile:', error);
    return res.status(500).json({
      errCode: 500,
      message: 'Server error',
      error: error.message
    });
  }
};

let deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await userService.deleteAccount(userId);

    if (result.errCode !== 0) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in deleteAccount:', error);
    return res.status(500).json({
      errCode: 500,
      message: 'Server error',
      error: error.message
    });
  }
};

const estimateDiamondValue = async (req, res) => {
  try {
    const {
      caratWeight,
      color,
      cut,
      clarity,
      fluorescence,
      origin,
      shape,
      polish,
      symmetry,
      proportions,
      measurements,
    } = req.body;

    if (!caratWeight || !fluorescence || !color || !cut || !clarity) {
      return res.status(400).json({
        errCode: 1,
        message: "Invalid input parameters"
      });
    }

    // Call service function to estimate diamond value
    const estimatedPrice = await userService.estimateDiamondValue({
      caratWeight,
      fluorescence,
      color,
      cut,
      clarity,
      origin,
      shape,
      polish,
      symmetry,
      proportions,
      measurements,
    });

    return res.status(200).json({
      errCode: 0,
      message: "Estimated diamond value",
      estimatedPrice
    });
  } catch (error) {
    console.error("Error in estimateDiamondValue controller:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Server error"
    });
  }
};


const viewValuatedDiamondInfo = async (req, res) => {
  try {

    const userId = req.user.id;

    const diamonds = await userService.getValuatedDiamondsByUserId(userId);

    return res.status(200).json({
      errCode: 0,
      message: 'Valuated diamond information retrieved successfully',
      diamonds
    });
  } catch (error) {
    console.error('Error in viewValuatedDiamondInfo controller:', error);
    return res.status(500).json({ errCode: 1, message: 'Server error', error: error.message });
  }
};


const estimateDiamondValueByCertificate = async (req, res) => {
  try {
    const { certificateId } = req.body;

    if (!certificateId) {
      return res.status(400).json({
        errCode: 1,
        message: 'Invalid input parameters or Certificate ID missing'
      });
    }

    const result = await userService.estimateDiamondValueByCertificate(certificateId);

    if (result.errCode === 0) {
      return res.status(200).json(result);
    } else if (result.errCode === 2) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error("Error in estimateDiamondValueByCertificate controller:", error);
    res.status(500).json({
      errCode: 1,
      message: 'Server error'
    });
  }
};

const handleFeedback = async (req, res) => {
  try {
    const { requestId, customerName, email, feedbackText } = req.body;

    if (!customerName || !email || !feedbackText) {
      return res.status(400).json({
        errCode: 1,
        message: 'Invalid input parameters or missing fields'
      });
    }

    const feedbackResult = await userService.submitFeedback(req.user.id, requestId, customerName, email, feedbackText);

    if (feedbackResult.errCode === 0) {
      return res.status(200).json(feedbackResult);
    } else {
      return res.status(500).json(feedbackResult);
    }
  } catch (error) {
    console.error("Error in handleFeedback controller:", error);
    res.status(500).json({
      errCode: 1,
      message: 'Server error'
    });
  }
};

const handleGetFinishRequestByUser = async (req, res) => {
  try {

    const finishRequest = await userService.finishRequest(req.user.id);
    return res.status(200).json(finishRequest);
  } catch (error) {
    console.error("Error in handleFeedback controller:", error);
    res.status(500).json({
      errCode: 1,
      message: 'Server error'
    });
  }
};

const handleNotificationValuationSuccess = async (req, res) => {
  try {
    const { requestId } = req.body;
    const result = await userService.notificationValuationSuccess(requestId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in handleNotificationValuationSuccess controller:", error);
    res.status(500).json({
      errCode: 1,
      message: 'Server error'
    });
  }
};

const handleActiveAccount = async (req, res) => {
  try {
    const { username, code } = req.body;
    const result = await userService.activeAccount(username, code);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in handleActiveAccount controller:", error);
    res.status(500).json({
      errCode: 1,
      message: 'Server error'
    });
  }
};


let handleCreateNewRequest = async (req, res) => {
  let data = req.body;
  let message = await userService.createNewRequest(data);
  return res.status(200).json(message);
};
let handlePayment = async (req, res) => {
  let message = await userService.payment(req.body);
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
  let message = await userService.queryDR(req);
  return res.status(200).json(message);
}

let handleRefund = async (req, res) => {
  let message = await userService.refund(req);
  return res.status(200).json(message);
}
let handlePaypal = async (req, res) => {
  try {
    let message = await userService.paypalRequest(req);
    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({ errCode: 1, message: 'Internal Server Error' });
  }
};

let handlePaypalReturn = async (req, res) => {
  try {
    let message = await userService.paypalReturn(req);
    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({ errCode: 1, message: 'Internal Server Error' });
  }
};

let handleGetRequestByUser = async (req, res) => {
  try {
    let message = await userService.getRequestByUser(req.user.id);
    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({ errCode: 1, message: 'Internal Server Error' });
  }
}

const handleGetUserService = async (req, res) => {
  try {
    const services = await userService.getAllServices();

    return res.status(200).json({
      errCode: 0,
      message: 'Services retrieved successfully',
      services
    });
  } catch (error) {
    console.error('Error in handleGetUserService controller:', error);
    return res.status(500).json({ errCode: 1, message: 'Server error', error: error.message });
  }
}

const handleGetUserBill = async (req, res) => {
  try {
    const userId = req.user.id;

    const userbills = await userService.getUserBill(userId);

    return res.status(200).json({
      errCode: 0,
      message: 'Bills retrieved successfully',
      userbills
    });
  } catch (error) {
    console.error('Error in handleGetUserBill controller:', error);
    return res.status(500).json({ errCode: 1, message: 'Server error', error: error.message });
  }
}
module.exports = {
  handleLogin: handleLogin,
  handleRegister: handleRegister,
  handleForgotPassword: handleForgotPassword,
  handleVerifyEmail: handleVerifyEmail,
  handleResetPassword: handleResetPassword,
  getProfile: getProfile,
  updateProfile: updateProfile,
  deleteAccount: deleteAccount,
  estimateDiamondValue: estimateDiamondValue,
  viewValuatedDiamondInfo: viewValuatedDiamondInfo,
  estimateDiamondValueByCertificate: estimateDiamondValueByCertificate,
  handleFeedback: handleFeedback,
  handleCreateNewRequest: handleCreateNewRequest,
  handlePayment: handlePayment,
  handleCompletePayment: handleCompletePayment,
  handleRegisterMail: handleRegisterMail,
  handleCreatePaymentUrl: handleCreatePaymentUrl,
  handleVnPayReturn: handleVnPayReturn,
  handleVnPayIPN: handleVnPayIPN,
  handleQueryDR: handleQueryDR,
  handleRefund: handleRefund,
  handlePaypal: handlePaypal,
  handlePaypalReturn: handlePaypalReturn,
  handleGetRequestByUser: handleGetRequestByUser,
  handleGetFinishRequestByUser: handleGetFinishRequestByUser,
  handleNotificationValuationSuccess: handleNotificationValuationSuccess,
  handleActiveAccount: handleActiveAccount,
  handleGetUserService: handleGetUserService,
  handleGetUserBill: handleGetUserBill,
};
