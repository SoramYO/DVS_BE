const sql = require("mssql");
var bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
require("dotenv").config();
const jwt = require("jsonwebtoken");
var config = require("../config/dbconfig");
let $ = require("jquery");
const request = require("request");
const moment = require("moment");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const paypal = require("paypal-rest-sdk");

let handleUserLogin = (username, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            const pool = await sql.connect(config);
            let isExist = await checkUserName(username);
            if (isExist) {
                let user = await pool
                    .request()
                    .input("username", sql.NVarChar, username)

                    .query(
                        "SELECT ac.id, password, firstName, lastName, status, r.name as role FROM Account as ac JOIN Role as r ON ac.roleId = r.id WHERE username = @username"
                    );

                userData = user.recordset[0];
                if (user.recordset.length > 0) {
                    //compare password
                    let check = await bcrypt.compareSync(password, userData.password);
                    if (userData.status === 1) {
                        if (check) {
                            userData.errCode = 0;
                            userData.errMessage = "OK";

                            const {
                                password,
                                status,
                                errCode,
                                errMessage,
                                ...userWithoutPassword
                            } = user.recordset[0];

                            userData.user = userWithoutPassword;
                        } else {
                            userData.errCode = 1;
                            userData.errMessage = "Username or password is incorrect";
                        }
                    } else {
                        userData.errCode = 4;
                        userData.errMessage = "Account has been locked";
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = "User not found";
                }
            } else {
                userData.errCode = 3;
                userData.errMessage = "Username or password is incorrect";
            }
            resolve(userData);
        } catch (error) {
            resolve({ errCode: 1, message: "Server error", error });
        }
    });
};

let checkUserName = (username) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect(config);
            let user = await pool
                .request()
                .input("username", sql.NVarChar, username)
                .query("SELECT username FROM Account WHERE username = @username");
            if (user.recordset.length > 0) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            resolve({ errCode: 1, message: "Server error", error });
        }
    });
};

let handleUserRegister = (
    username,
    password,
    firstName,
    lastName,
    email,
    phone
) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isExist = await checkUserName(username);
            if (isExist) {
                resolve({
                    errCode: 1,
                    message: "Username exist try another username!",
                });
            } else if (!password || password.length < 6) {
                resolve({
                    errCode: 3,
                    message: "Password must be at least 6 characters long.",
                });
            } else {
                const pool = await sql.connect(config);
                const hashedPassword = await bcrypt.hash(password, 10); // Hash the password using bcrypt

                const request = pool.request();
                request.input("username", sql.NVarChar, username);
                request.input("password", sql.NVarChar, hashedPassword);
                request.input("firstName", sql.NVarChar, firstName);
                request.input("lastName", sql.NVarChar, lastName);
                request.input("email", sql.NVarChar, email);
                request.input("phone", sql.NVarChar, phone);
                request.input("roleId", sql.Int, 1);
                request.input("status", sql.Int, 1);
                request.input("createdAt", sql.DateTime, new Date());

                const result = await request.query(`
        INSERT INTO Account (username, password, firstName, lastName, email, phone, roleId, status, createdAt)
        VALUES (@username, @password, @firstName, @lastName, @email, @phone, @roleId, @status, @createdAt)
        `);

                resolve({ errCode: 0, message: "Register success" });
            }
        } catch (error) {
            resolve({ errCode: 1, message: "Server error", error });
        }
    });
};

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            resolve({ errCode: 1, message: "Server error", error });
        }
    });
};

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "Gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

const generateToken = () => {
    return crypto.randomBytes(32).toString("hex");
};

const forgotPassword = async (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect(config);
            const request = pool.request();
            request.input("email", sql.NVarChar, email);
            const result = await request.query(
                "SELECT id FROM Account WHERE email = @email"
            );
            if (result.recordset.length === 0) {
                resolve({ errCode: 2, message: "Email not found" });
            }

            const token = generateToken();
            const userId = result.recordset[0].id;

            await request
                .input("userId", sql.Int, userId)
                .input("token", sql.NVarChar, token)
                .input("expiryDate", sql.DateTime, new Date(Date.now() + 3600000))
                .query(
                    "INSERT INTO PasswordResetTokens (userId, token, expiryDate) VALUES (@userId, @token, @expiryDate)"
                );

            const resetLink = `https://dvs-fe-soramyos-projects.vercel.app/reset-password?token=${token}&id=${userId}`;
            await transporter.sendMail({
                from: '"Diamond Valuation System" <no-reply@diamondvaluationsystem.com>',
                to: email,
                subject: "Password Reset",
                html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                            <div style="text-align: center; margin-bottom: 20px;">
                                <img src="https://marketplace.canva.com/EAFqberfhMA/1/0/1600w/canva-black-gold-luxury-modern-diamond-brand-store-logo-VmwEPkcpqzE.jpg" alt="Diamond Valuation System" style="width: 100px; height: auto;">
                            </div>
                            <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
                            <p style="color: #555;">Hello,</p>
                            <p style="color: #555;">We received a request to reset your password for your Diamond Valuation System account. Click the button below to reset your password:</p>
                            <div style="text-align: center; margin: 20px 0;">
                                <a href="${resetLink}" style="background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">Reset Password</a>
                            </div>
                            <p style="color: #555;">If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
                            <p style="color: #555;">Thank you,<br>The Diamond Valuation System Team</p>
                        </div>
                    `,
            });
            resolve({ errCode: 0, message: "Email sent successfully" });
        } catch (error) {
            resolve({ errCode: 1, message: "Server error", error });
        }
    });
};

let sendSubscriptionEmail = async (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    background-color: #ffffff;
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color: #4CAF50;
                    color: #ffffff;
                    padding: 20px;
                    text-align: center;
                    border-radius: 8px 8px 0 0;
                }
                .header h1 {
                    margin: 0;
                }
                .content {
                    padding: 20px;
                }
                .content h2 {
                    color: #333333;
                }
                .content p {
                    color: #666666;
                    line-height: 1.6;
                }
                .content a {
                    color: #4CAF50;
                    text-decoration: none;
                }
                .footer {
                    text-align: center;
                    padding: 10px;
                    color: #999999;
                    font-size: 12px;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    margin: 20px 0;
                    background-color: #4CAF50;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 5px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to the Diamond Valuation System!</h1>
                </div>
                <div class="content">
                    <h2>Thank you for subscribing!</h2>
                    <p>Dear Valued Customer,</p>
                    <p>We are thrilled to have you on board. By subscribing to our newsletter, you will receive the latest updates, exclusive offers, and expert advice on diamonds directly to your inbox. Stay tuned for exciting news and promotions!</p>
                    <p>As a token of our appreciation, here's a special offer just for you:</p>
                    <p><a href="https://dvs-fe-soramyos-projects.vercel.app" class="button">Get Your Exclusive Offer</a></p>
                    <p>If you have any questions, feel free to <a href="mailto:support@diamondvaluation.com">contact us</a>. We're here to help you find the perfect diamond.</p>
                    <p>Best regards,<br>The Diamond Valuation Team</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 Diamond Valuation System. All rights reserved.</p>
                    <p>123 Diamond Street, Suite 100, Jewelry City, Country</p>
                </div>
            </div>
        </body>
        </html>
    `;
            await transporter.sendMail({
                from: "> Diamond Valuation System <",
                to: body.email,
                subject: "Welcome to Diamond Valuation System!",
                html: htmlContent,
            });

            resolve({ errCode: 0, message: "Email sent successfully" });
        } catch (error) {
            resolve({ errCode: 1, message: "Server error", error });
        }
    });
};

const verifyToken = async (query) => {
    return new Promise(async (resolve, reject) => {
        const { token, id } = query;
        try {
            const pool = await sql.connect(config);
            const request = pool.request();

            const result = await request
                .input("token", sql.NVarChar, token)
                .input("userId", sql.Int, id)
                .query(
                    "SELECT * FROM PasswordResetTokens WHERE token = @token AND userId = @userId AND expiryDate > GETDATE()"
                );

            if (result.recordset.length === 0) {
                resolve({ errCode: 2, message: "Invalid or expired token" });
            }

            resolve({ errCode: 0, message: "Token is valid" });
        } catch (error) {
            resolve({ errCode: 1, message: "Server error", error });
        }
    });
};

let resetPassword = async (body) => {
    return new Promise(async (resolve, reject) => {
        const { userId, token, password } = body;
        try {
            const pool = await sql.connect(config);

            // Kiểm tra token
            const checkTokenRequest = pool.request();
            const result = await checkTokenRequest
                .input("token", sql.NVarChar, token)
                .input("userId", sql.Int, userId)
                .query(
                    "SELECT * FROM PasswordResetTokens WHERE token = @token AND userId = @userId AND expiryDate > GETDATE()"
                );

            if (result.recordset.length === 0) {
                return resolve({ errCode: 2, message: "Invalid or expired token" });
            }
            //Hash mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10);
            //Cập nhật mật khẩu
            const updatePasswordRequest = pool.request();
            await updatePasswordRequest
                .input("userId", sql.Int, userId)
                .input("password", sql.NVarChar, hashedPassword)
                .query("UPDATE Account SET password = @password WHERE id = @userId");
            //Xóa token
            const deleteTokenRequest = pool.request();
            await deleteTokenRequest
                .input("userId", sql.Int, userId)
                .query("DELETE FROM PasswordResetTokens WHERE userId = @userId");

            resolve({ errCode: 0, message: "Password reset successfully" });
        } catch (error) {
            resolve({ errCode: 1, message: "Server error", error });
        }
    });
};

let createNewRequest = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect(config);
            const request = pool.request();
            request.input("proportions", sql.NVarChar, data.proportions);
            request.input("diamondOrigin", sql.NVarChar, data.diamondOrigin);
            request.input("caratWeight", sql.Float, data.caratWeight);
            request.input("measurements", sql.NVarChar, data.measurements);
            request.input("polish", sql.NVarChar, data.polish);
            request.input("flourescence", sql.NVarChar, data.flourescence);
            request.input("color", sql.NVarChar, data.color);
            request.input("cut", sql.NVarChar, data.cut);
            request.input("clarity", sql.NVarChar, data.clarity);
            request.input("symmetry", sql.NVarChar, data.symmetry);
            request.input("shape", sql.NVarChar, data.shape);
            request.input("requestImage", sql.NVarChar, data.requestImage);
            request.input("note", sql.NVarChar, data.note);
            request.input("userId", sql.Int, data.userId);
            request.input("processId", sql.Int, 1);
            request.input("serviceId", sql.Int, data.serviceId);

            const result = await request.query(`
                DECLARE @NewDiamondID TABLE (id INT);

                INSERT INTO Diamond (proportions, diamondOrigin, caratWeight, measurements, polish, flourescence, color, cut, clarity, symmetry, shape)
                OUTPUT INSERTED.id INTO @NewDiamondID
                VALUES (@proportions, @diamondOrigin, @caratWeight, @measurements, @polish, @flourescence, @color, @cut, @clarity, @symmetry, @shape);


                INSERT INTO Request (requestImage, note, createdDate, updatedDate, userId, processId, diamondId,serviceId , paymentStatus)
                VALUES (@requestImage, @note, GETDATE(), GETDATE(), @userId, @processId, (SELECT id FROM @NewDiamondID) , @serviceId, 'Unpaid');

                INSERT INTO Payment (requestId, paymentAmount, paymentDate)
                VALUES (SCOPE_IDENTITY(), 0, GETDATE());
            `);

            resolve({ errCode: 0, message: "Create new request success" });
        } catch (error) {
            resolve({ errCode: 1, message: "Server error", error });
        }
    });
};

let payment = (body, params) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect(config);
            const request = pool.request();
            request.input("requestId", sql.Int, params.id);
            request.input("paymentAmount", sql.Int, body.paymentAmount);
            let paymentStatus = "Unpaid";
            request.input("paymentStatus", sql.NVarChar, paymentStatus);
            request.input("paymentDate", sql.DateTime, new Date());
            await request.query(`
                UPDATE Payment
                SET paymentAmount = @paymentAmount, paymentDate = @paymentDate
                WHERE requestId = @requestId;

                UPDATE Request
                SET paymentStatus = @paymentStatus
                WHERE id = @requestId;
            `);
            resolve({ errCode: 0, message: "Payment success" });
        } catch (error) {
            resolve({ errCode: 1, message: "Server error", error });
        }
    });
};

let completePayment = async (params) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = await sql.connect(config);
            const request = pool.request();

            const serviceInfo = await request
                .input("requestId", sql.Int, params.id)
                .query(
                    `SELECT s.price, p.paymentAmount FROM Request r JOIN Service s ON r.serviceId = s.id LEFT JOIN Payment p ON r.id = p.requestId WHERE r.id = @requestId`
                );

            const servicePrice = serviceInfo.recordset[0].price;
            const paidAmount = serviceInfo.recordset[0].paymentAmount || 0;
            const remainingAmount = servicePrice - paidAmount;
            const fullPayment = remainingAmount + paidAmount;

            await request
                .input("paymentAmount", sql.Int, fullPayment)
                .input("paymentDate", sql.DateTime, new Date()).query(`
                UPDATE Payment
                SET paymentAmount = @paymentAmount, paymentDate = @paymentDate
                WHERE requestId = @requestId;
            `);

            let paymentStatus =
                remainingAmount === 0 ? "Full Payment" : "Partially Paid";
            await request.input("paymentStatus", sql.NVarChar, paymentStatus).query(`
                UPDATE Request
                SET paymentStatus = @paymentStatus
                WHERE id = @requestId;
            `);

            return { errCode: 0, message: "Payment completed successfully" };
        } catch (error) {
            resolve({ errCode: 1, message: "Server error", error });
        }
    });
};

let createPaymentUrl = async (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            process.env.TZ = "Asia/Ho_Chi_Minh";

            let date = new Date();
            let createDate = moment(date).format("YYYYMMDDHHmmss");

            let ipAddr =
                req.headers["x-forwarded-for"] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

            let config = require("../config/default.json");

            let tmnCode = config.vnp_TmnCode;
            let secretKey = config.vnp_HashSecret;
            let vnpUrl = config.vnp_Url;
            let returnUrl = config.vnp_ReturnUrl;
            let orderId = moment(date).format("DDHHmmss");
            let amount = req.body.amount;
            let bankCode = req.body.bankCode;

            let locale = req.body.language;
            if (locale === null || locale === "") {
                locale = "vn";
            }
            let currCode = "VND";
            let vnp_Params = {};
            vnp_Params["vnp_Version"] = "2.1.0";
            vnp_Params["vnp_Command"] = "pay";
            vnp_Params["vnp_TmnCode"] = tmnCode;
            vnp_Params["vnp_Locale"] = locale;
            vnp_Params["vnp_CurrCode"] = currCode;
            vnp_Params["vnp_TxnRef"] = orderId;
            vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
            vnp_Params["vnp_OrderType"] = "other";
            vnp_Params["vnp_Amount"] = amount * 100;
            vnp_Params["vnp_ReturnUrl"] = returnUrl;
            vnp_Params["vnp_IpAddr"] = ipAddr;
            vnp_Params["vnp_CreateDate"] = createDate;
            if (bankCode !== null && bankCode !== "") {
                vnp_Params["vnp_BankCode"] = bankCode;
            }

            vnp_Params = sortObject(vnp_Params);

            let querystring = require("qs");
            let signData = querystring.stringify(vnp_Params, { encode: false });
            let hmac = crypto.createHmac("sha512", secretKey);
            let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
            vnp_Params["vnp_SecureHash"] = signed;
            vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

            resolve({ errorCode: 0, message: "Success", data: vnpUrl });
        } catch (error) {
            resolve({ errCode: 1, message: "Server error", error });
        }
    });
};

let vnPayReturn = async (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let vnp_Params = req.query;

            let secureHash = vnp_Params["vnp_SecureHash"];

            delete vnp_Params["vnp_SecureHash"];
            delete vnp_Params["vnp_SecureHashType"];

            vnp_Params = sortObject(vnp_Params);

            let config = require("../config/default.json");
            let tmnCode = config.vnp_TmnCode;
            let secretKey = config.vnp_HashSecret;

            let querystring = require("qs");
            let signData = querystring.stringify(vnp_Params, { encode: false });
            let crypto = require("crypto");
            let hmac = crypto.createHmac("sha512", secretKey);
            let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

            if (secureHash === signed) {
                //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
                resolve({
                    errorCode: 0,
                    message: "Success",
                    data: vnp_Params["vnp_ResponseCode"],
                });
            } else {
                resolve({
                    errorCode: 97,
                    message: "Fail",
                    data: vnp_Params["vnp_ResponseCode"],
                });
            }
        } catch (error) {
            resolve({ errCode: 1, message: "Server error", error });
        }
    });
};
let vnPayIPN = async (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let vnp_Params = req.query;
            let secureHash = vnp_Params["vnp_SecureHash"];

            let orderId = vnp_Params["vnp_TxnRef"];
            let rspCode = vnp_Params["vnp_ResponseCode"];

            delete vnp_Params["vnp_SecureHash"];
            delete vnp_Params["vnp_SecureHashType"];

            vnp_Params = sortObject(vnp_Params);
            let config = require("../config/default.json");
            let secretKey = config.get("vnp_HashSecret");
            let querystring = require("qs");
            let signData = querystring.stringify(vnp_Params, { encode: false });
            let crypto = require("crypto");
            let hmac = crypto.createHmac("sha512", secretKey);
            let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

            let paymentStatus = "0"; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
            //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
            //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

            let checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
            let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
            if (secureHash === signed) {
                //kiểm tra checksum
                if (checkOrderId) {
                    if (checkAmount) {
                        if (paymentStatus == "0") {
                            //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
                            if (rspCode == "00") {
                                //thanh cong
                                //paymentStatus = '1'
                                // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
                                resolve({ RspCode: "00", Message: "Success" });
                            } else {
                                //that bai
                                //paymentStatus = '2'
                                // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
                                resolve({ RspCode: "01", Message: "Fail" });
                            }
                        } else {
                            resolve({
                                RspCode: "02",
                                Message: "This order has been updated to the payment status",
                            });
                        }
                    } else {
                        resolve({ RspCode: "04", Message: "Amount invalid" });
                    }
                } else {
                    resolve({ RspCode: "01", Message: "Order not found" });
                }
            } else {
                resolve({ RspCode: "97", Message: "Checksum failed" });
            }
        } catch (error) {
            resolve({ errCode: 1, message: "Server error", error });
        }
    });
};

let queryDR = async (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            process.env.TZ = "Asia/Ho_Chi_Minh";
            let date = new Date();

            let config = require("../config/default.json");
            let crypto = require("crypto");

            let vnp_TmnCode = config.vnp_TmnCode;
            let secretKey = config.vnp_HashSecret;
            let vnp_Api = config.vnp_Api;

            let vnp_TxnRef = req.body.orderId;
            let vnp_TransactionDate = req.body.transDate;

            let vnp_RequestId = moment(date).format("HHmmss");
            let vnp_Version = "2.1.0";
            let vnp_Command = "querydr";
            let vnp_OrderInfo = "Truy van GD ma:" + vnp_TxnRef;

            let vnp_IpAddr =
                req.headers["x-forwarded-for"] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

            let currCode = "VND";
            let vnp_CreateDate = moment(date).format("YYYYMMDDHHmmss");

            let data =
                vnp_RequestId +
                "|" +
                vnp_Version +
                "|" +
                vnp_Command +
                "|" +
                vnp_TmnCode +
                "|" +
                vnp_TxnRef +
                "|" +
                vnp_TransactionDate +
                "|" +
                vnp_CreateDate +
                "|" +
                vnp_IpAddr +
                "|" +
                vnp_OrderInfo;

            let hmac = crypto.createHmac("sha512", secretKey);
            let vnp_SecureHash = hmac.update(new Buffer(data, "utf-8")).digest("hex");

            let dataObj = {
                vnp_RequestId: vnp_RequestId,
                vnp_Version: vnp_Version,
                vnp_Command: vnp_Command,
                vnp_TmnCode: vnp_TmnCode,
                vnp_TxnRef: vnp_TxnRef,
                vnp_OrderInfo: vnp_OrderInfo,
                vnp_TransactionDate: vnp_TransactionDate,
                vnp_CreateDate: vnp_CreateDate,
                vnp_IpAddr: vnp_IpAddr,
                vnp_SecureHash: vnp_SecureHash,
            };
            // /merchant_webapi/api/transaction
            request(
                {
                    url: vnp_Api,
                    method: "POST",
                    json: true,
                    body: dataObj,
                },
                function (error, response, body) {
                    resolve(body);
                }
            );
        } catch (error) {
            resolve({ errCode: 1, message: "Server error", error });
        }
    });
};
let refund = async (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            process.env.TZ = "Asia/Ho_Chi_Minh";
            let date = new Date();

            let config = require("../config/default.json");
            let crypto = require("crypto");

            let vnp_TmnCode = config.vnp_TmnCode;
            let secretKey = config.vnp_HashSecret;
            let vnp_Api = config.vnp_Api;

            let vnp_TxnRef = req.body.orderId;
            let vnp_TransactionDate = req.body.transDate;
            let vnp_Amount = req.body.amount * 100;
            let vnp_TransactionType = req.body.transType;
            let vnp_CreateBy = req.body.user;

            let currCode = "VND";

            let vnp_RequestId = moment(date).format("HHmmss");
            let vnp_Version = "2.1.0";
            let vnp_Command = "refund";
            let vnp_OrderInfo = "Hoan tien GD ma:" + vnp_TxnRef;

            let vnp_IpAddr =
                req.headers["x-forwarded-for"] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

            let vnp_CreateDate = moment(date).format("YYYYMMDDHHmmss");

            let vnp_TransactionNo = "0";

            let data =
                vnp_RequestId +
                "|" +
                vnp_Version +
                "|" +
                vnp_Command +
                "|" +
                vnp_TmnCode +
                "|" +
                vnp_TransactionType +
                "|" +
                vnp_TxnRef +
                "|" +
                vnp_Amount +
                "|" +
                vnp_TransactionNo +
                "|" +
                vnp_TransactionDate +
                "|" +
                vnp_CreateBy +
                "|" +
                vnp_CreateDate +
                "|" +
                vnp_IpAddr +
                "|" +
                vnp_OrderInfo;
            let hmac = crypto.createHmac("sha512", secretKey);
            let vnp_SecureHash = hmac.update(new Buffer(data, "utf-8")).digest("hex");

            let dataObj = {
                vnp_RequestId: vnp_RequestId,
                vnp_Version: vnp_Version,
                vnp_Command: vnp_Command,
                vnp_TmnCode: vnp_TmnCode,
                vnp_TransactionType: vnp_TransactionType,
                vnp_TxnRef: vnp_TxnRef,
                vnp_Amount: vnp_Amount,
                vnp_TransactionNo: vnp_TransactionNo,
                vnp_CreateBy: vnp_CreateBy,
                vnp_OrderInfo: vnp_OrderInfo,
                vnp_TransactionDate: vnp_TransactionDate,
                vnp_CreateDate: vnp_CreateDate,
                vnp_IpAddr: vnp_IpAddr,
                vnp_SecureHash: vnp_SecureHash,
            };

            request(
                {
                    url: vnp_Api,
                    method: "POST",
                    json: true,
                    body: dataObj,
                },
                function (error, response, body) {
                    resolve(body);
                }
            );
        } catch (error) {
            resolve({ errCode: 1, message: "Server error", error });
        }
    });
};

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

paypal.configure({
    mode: "sandbox",
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

let paypalRequest = async (req) => {
    return new Promise((resolve, reject) => {
        try {
            let create_payment_json = {
                intent: "sale",
                payer: {
                    payment_method: "paypal",
                },
                redirect_urls: {
                    return_url: "http://localhost:8080/api/paypalReturn",
                    cancel_url: "http://localhost:3000/cancel",
                },
                transactions: [
                    {
                        item_list: {
                            items: [
                                {
                                    name: "item",
                                    sku: "item",
                                    price: req.body.amount,
                                    currency: "USD",
                                    quantity: 1,
                                },
                            ],
                        },
                        amount: {
                            currency: "USD",
                            total: req.body.amount,
                        },
                        description: "This is the payment description.",
                    },
                ],
            };

            paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    reject(error);
                } else {
                    for (let i = 0; i < payment.links.length; i++) {
                        if (payment.links[i].rel === "approval_url") {
                            resolve({
                                errCode: 0,
                                message: "Success",
                                data: payment.links[i].href,
                            });
                        }
                    }
                }
            });
        } catch (error) {
            resolve({ errCode: 1, message: "Server error", error });
        }
    });
};

let paypalReturn = async (req) => {
    return new Promise((resolve, reject) => {
        try {
            let payerId = req.query.PayerID;
            let paymentId = req.query.paymentId;

            let execute_payment_json = {
                payer_id: payerId,
            };

            paypal.payment.execute(
                paymentId,
                execute_payment_json,
                function (error, payment) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({ errCode: 0, message: "Success", data: payment });
                    }
                }
            );
        } catch (error) {
            resolve({ errCode: 1, message: "Server error", error });
        }
    });
};

let getRequestByUser = async (params) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userId = params.id;

            const pool = await sql.connect(config);
            const requests = await pool.request().query(`
            SELECT r.id, r.requestImage, r.createdDate, r.paymentStatus, s.serviceName
            FROM Request r JOIN Service s ON r.serviceId = s.id
            WHERE r.userId = ${userId}
            `);
            resolve({ errCode: 0, message: "Success", data: requests.recordset });
        } catch (error) {
            resolve({ errCode: 1, message: "Server error", error });
        }
    });
};

module.exports = {
    handleUserLogin: handleUserLogin,
    checkUserName: checkUserName,
    forgotPassword: forgotPassword,
    verifyToken: verifyToken,
    resetPassword: resetPassword,
    handleUserRegister: handleUserRegister,
    hashUserPassword: hashUserPassword,
    createNewRequest: createNewRequest,
    payment: payment,
    completePayment: completePayment,
    sendSubscriptionEmail: sendSubscriptionEmail,
    createPaymentUrl: createPaymentUrl,
    vnPayReturn: vnPayReturn,
    vnPayIPN: vnPayIPN,
    queryDR: queryDR,
    refund: refund,
    paypalRequest: paypalRequest,
    paypalReturn: paypalReturn,
    getRequestByUser: getRequestByUser,
};
