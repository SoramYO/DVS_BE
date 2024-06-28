const express = require('express');
const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');
const staffController = require('../controllers/staffController');
const managerController = require('../controllers/managerController');
const { verifyToken, verifyAdmin, verifyStaff } = require('../middleware/auth');

let router = express.Router();

let initWebRoutes = (app) => {
  /**
  * @swagger
  * /api/login:
  *  post:
  *   summary: Login to the application
  *   description: Login to the application
  *   tags:
  *      - User
  *   requestBody:
  *     required: true
  *     content:
  *       application/json:
  *         schema:
  *           type: object
  *           properties:
  *             username:
  *               type: string
  *             password:
  *               type: string
  *   responses:
  *     "200":
  *       description: A successful response
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               errCode:
  *                 type: integer
  *               message:
  *                 type: string
  *               user:
  *                 type: object
  *     "400":
  *       description: Bad request
  */
  router.post("/login", userController.handleLogin);

  /**
  * @swagger
  * /api/register:
  *  post:
  *   summary: Register a new user
  *   description: Register a new user
  *   tags:
  *      - User
  *   requestBody:
  *     required: true
  *     content:
  *       application/json:
  *         schema:
  *           type: object
  *           properties:
  *             username:
  *               type: string
  *             password:
  *               type: string
  *             firstName:
  *               type: string
  *             lastName:
  *               type: string
  *             email:
  *               type: string
  *             phone:
  *               type: string
  *   responses:
  *     "200":
  *       description: User registered successfully
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               errCode:
  *                 type: integer
  *               message:
  *                 type: string
  *     "400":
  *       description: Bad request
  */
  router.post("/register", userController.handleRegister);

  /**
* @swagger
* /api/forgot-password:
*   post:
*     summary: Request password reset
*     description: Sends an email with a password reset link
*     tags: [User]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               email:
*                 type: string
*                 example: user@example.com
*     responses:
*       200:
*         description: Password reset link sent
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*       404:
*         description: Email not found
*       500:
*         description: Server error
*/
  router.post("/forgot-password", userController.handleForgotPassword);

  //    /**
  // * @swagger
  // * /api/verify-token:
  // *   post:
  // *     summary: Verify password reset token
  // *     description: Verifies if the password reset token is valid
  // *     tags: [Authentication]
  // *     parameters:
  // *       - in: query
  // *         name: token
  // *         schema:
  // *           type: string
  // *         required: true
  // *       - in: query
  // *         name: id
  // *         schema:
  // *           type: integer
  // *         required: true
  // *     responses:
  // *       200:
  // *         description: Token is valid
  // *         content:
  // *           application/json:
  // *             schema:
  // *               type: object
  // *               properties:
  // *                 message:
  // *                   type: string
  // *       400:
  // *         description: Invalid or expired token
  // *       500:
  // *         description: Server error
  // */
  //    router.post("/verify-token", userController.handleVerifyEmail);

  /**
  * @swagger
  * /api/reset-password:
  *   put:
  *     summary: Reset password
  *     description: Resets the user's password
  *     tags: [User]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               userId:
  *                 type: integer
  *                 example: id
  *               token:
  *                 type: string
  *                 example: 'token'
  *               password:
  *                 type: string
  *                 example: 'newpassword123'
  *     responses:
  *       200:
  *         description: Password reset successfully
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 errCode:
  *                   type: integer
  *                   example: 0
  *                 message:
  *                   type: string
  *                   example: 'Password reset successfully'
  *       400:
  *         description: Invalid or expired token
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 errCode:
  *                   type: integer
  *                   example: 2
  *                 message:
  *                   type: string
  *                   example: 'Invalid or expired token'
  *       500:
  *         description: Server error
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 errCode:
  *                   type: integer
  *                   example: 1
  *                 message:
  *                   type: string
  *                   example: 'Server error'
  *                 error:
  *                   type: object
  */
  router.put("/reset-password", userController.handleResetPassword);

  /**
   * @swagger
   * /api/profile:
   *   get:
   *     summary: Get user profile
   *     description: Retrieves the user's profile information
   *     tags: [User]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User profile retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                   example: 1
   *                 username:
   *                   type: string
   *                   example: john_doe
   *                 firstName:
   *                   type: string
   *                   example: John
   *                 lastName:
   *                   type: string
   *                   example: Doe
   *                 email:
   *                   type: string
   *                   example: john.doe@example.com
   *                 phone:
   *                   type: string
   *                   example: '+123456789'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Access Denied
   */
  router.get("/profile", verifyToken, userController.getProfile);

  /**
* @swagger
* /api/profile:
*   put:
*     summary: Update user profile
*     description: Updates the user's profile information
*     tags: [User]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               firstName:
*                 type: string
*                 example: John
*               lastName:
*                 type: string
*                 example: Doe
*               email:
*                 type: string
*                 example: john.doe@example.com
*               phone:
*                 type: string
*                 example: '+123456789'
*     responses:
*       200:
*         description: Profile updated successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errCode:
*                   type: integer
*                   example: 0
*                 message:
*                   type: string
*                   example: 'Profile updated successfully'
*       400:
*         description: Invalid input data
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errCode:
*                   type: integer
*                   example: 1
*                 message:
*                   type: string
*                   example: 'Invalid input data'
*       401:
*         description: Unauthorized
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Access Denied
*       500:
*         description: Server error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errCode:
*                   type: integer
*                   example: 1
*                 message:
*                   type: string
*                   example: 'Server error'
*/
  router.put("/profile", verifyToken, userController.updateProfile);

  /**
* @swagger
* /api/profile-remove:
*   put:
*     summary: Delete user account
*     description: Deletes the user's account permanently
*     tags: [User]
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: Account deleted successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errCode:
*                   type: integer
*                   example: 0
*                 message:
*                   type: string
*                   example: 'Account deleted successfully'
*       401:
*         description: Unauthorized
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Access Denied
*       500:
*         description: Server error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errCode:
*                   type: integer
*                   example: 1
*                 message:
*                   type: string
*                   example: 'Server error'
*/
  router.put("/profile-remove", verifyToken, userController.deleteAccount);

  /**
   * @swagger
   * /api/request:
   *   post:
   *     summary: Create a new valuation request
   *     tags:
   *       - User
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               requestImage:
   *                 type: string
   *               note:
   *                 type: string
   *               userId:
   *                 type: integer
   *               serviceId:
   *                 type: integer
   *     responses:
   *       '200':
   *         description: A successful response with the requestId
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errCode:
   *                   type: integer
   *                 message:
   *                   type: string
   *                 requestId:
   *                   type: integer
   *       '400':
   *         description: Bad request, missing or invalid parameters
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errCode:
   *                   type: integer
   *                 message:
   *                   type: string
   *       '401':
   *         description: Unauthorized, missing or invalid token
   *       '500':
   *         description: Internal server error
   */
  router.post("/request", verifyToken, userController.handleCreateNewRequest);

  /**
  * @swagger
  * /api/estimate-diamond-value:
  *   post:
  *     summary: Estimate diamond value
  *     description: Calculate the estimated value of a diamond based on its properties
  *     tags:
  *       - Diamond
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               caratWeight:
  *                 type: number
  *                 example: 1.5
  *               color:
  *                 type: string
  *                 example: 'D'
  *               clarity:
  *                 type: string
  *                 example: 'IF'
  *               cut:
  *                 type: string
  *                 example: 'Excellent'
  *               fluorescence:
  *                 type: string
  *                 example: 'None'
  *               origin:
  *                 type: string
  *                 example: 'Natural'
  *               shape:
  *                 type: string
  *                 example: 'Round'
  *               polish:
  *                 type: string
  *                 example: 'Excellent'
  *               symmetry:
  *                 type: string
  *                 example: 'Excellent'
  *               proportions:
  *                 type: string
  *                 example: 'Ideal'
  *               measurements:
  *                 type: string
  *                 example: 'Small'
  *     responses:
  *       200:
  *         description: Successfully estimated diamond value
  *         schema:
  *           type: object
  *           properties:
  *             errCode:
  *               type: integer
  *               example: 0
  *             message:
  *               type: string
  *               example: 'Estimated diamond value'
  *             estimatedPrice:
  *               type: number
  *               example: 1500
  *       400:
  *         description: Invalid input parameters
  *         schema:
  *           type: object
  *           properties:
  *             errCode:
  *               type: integer
  *               example: 1
  *             message:
  *               type: string
  *               example: 'Invalid input parameters'
  *       500:
  *         description: Server error
  *         schema:
  *           type: object
  *           properties:
  *             errCode:
  *               type: integer
  *               example: 1
  *             message:
  *               type: string
  *               example: 'Server error'
  */
  router.post("/estimate-diamond-value", userController.estimateDiamondValue);

  /**
* @swagger
* /api/view-valuated-diamond-info:
*   get:
*     summary: View own valuated diamond information
*     description: Retrieve detailed information of diamonds owned by the authenticated user and have been valued
*     tags: [Diamond]
*     security:
*       - bearerAuth: []
*     responses:
*       '200':
*         description: Successfully retrieved valuated diamond information
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errCode:
*                   type: integer
*                   example: 0
*                 message:
*                   type: string
*                   example: 'Valuated diamond information retrieved successfully'
*                 diamonds:
*                   type: array
*                   items:
*                     type: object
*                     properties:
*                       diamondId:
*                         type: integer
*                         example: 123
*                       cut:
*                         type: string
*                         example: 'Excellent'
*                       color:
*                         type: string
*                         example: 'D'
*                       clarity:
*                         type: string
*                         example: 'IF'
*                       caratWeight:
*                         type: number
*                         example: 1.5
*                       estimatedPrice:
*                         type: number
*                         example: 1500
*       '401':
*         description: Unauthorized, user not authenticated
*       '500':
*         description: Server error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errCode:
*                   type: integer
*                   example: 1
*                 message:
*                   type: string
*                   example: 'Server error'
*/
  router.get('/view-valuated-diamond-info', verifyToken, userController.viewValuatedDiamondInfo);

  /**
   * @swagger
   * /api/services:
   *   get:
   *     summary: View services
   *     description: Retrieve a list of available services
   *     tags: [Service Management]
   *     responses:
   *       '200':
   *         description: Successfully retrieved list of services
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errCode:
   *                   type: integer
   *                   example: 0
   *                 message:
   *                   type: string
   *                   example: 'Services retrieved successfully'
   *                 services:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       serviceName:
   *                         type: string
   *                         example: 'Diamond Appraisal'
   *                       price:
   *                         type: number
   *                         example: 200
   *       '500':
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errCode:
   *                   type: integer
   *                   example: 1
   *                 message:
   *                   type: string
   *                   example: 'Server error'
   */
  router.get('/services', adminController.handleViewServices);

  /**
   * @swagger
   * /api/service:
   *   post:
   *     summary: Create new service
   *     description: Create a new service in the system
   *     tags: [Service Management]
   *     security:
   *       - bearerAuth: []
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               serviceName:
   *                 type: string
   *                 example: 'Diamond Appraisal'
   *               price:
   *                 type: number
   *                 example: 200
   *     responses:
   *       '200':
   *         description: Service created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errCode:
   *                   type: integer
   *                   example: 0
   *                 message:
   *                   type: string
   *                   example: 'Service created successfully'
   *       '400':
   *         description: Invalid input parameters
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errCode:
   *                   type: integer
   *                   example: 1
   *                 message:
   *                   type: string
   *                   example: 'Invalid input parameters'
   *       '500':
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errCode:
   *                   type: integer
   *                   example: 1
   *                 message:
   *                   type: string
   *                   example: 'Server error'
   */
  router.post("/service", verifyToken, adminController.handleCreateNewService);

  /**
* @swagger
* /api/service:
*   put:
*     summary: Update service
*     description: Update an existing service in the system
*     tags: [Service Management]
*     security:
*       - bearerAuth: []
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               serviceId:
*                 type: integer
*                 example: 1
*               serviceName:
*                 type: string
*                 example: 'Diamond Appraisal'
*               price:
*                 type: number
*                 example: 200
*     responses:
*       '200':
*         description: Service updated successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errCode:
*                   type: integer
*                   example: 0
*                 message:
*                   type: string
*                   example: 'Service updated successfully'
*       '400':
*         description: Invalid input parameters or Service ID missing
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errCode:
*                   type: integer
*                   example: 1
*                 message:
*                   type: string
*                   example: 'Invalid input parameters or Service ID missing'
*       '404':
*         description: Service not found
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errCode:
*                   type: integer
*                   example: 2
*                 message:
*                   type: string
*                   example: 'Service not found'
*       '500':
*         description: Server error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errCode:
*                   type: integer
*                   example: 1
*                 message:
*                   type: string
*                   example: 'Server error'
*/
  router.put("/service", verifyToken, adminController.handleUpdateService);

  /**
* @swagger
* /api/service/{serviceId}:
*   delete:
*     summary: Delete service
*     description: Delete an existing service in the system by serviceId
*     tags: [Service Management]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: serviceId
*         required: true
*         schema:
*           type: integer
*         example: 1
*         description: ID of the service to delete
*     responses:
*       '200':
*         description: Service deleted successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errCode:
*                   type: integer
*                   example: 0
*                 message:
*                   type: string
*                   example: 'Service deleted successfully'
*       '400':
*         description: Invalid input parameters or Service ID missing
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errCode:
*                   type: integer
*                   example: 1
*                 message:
*                   type: string
*                   example: 'Invalid input parameters or Service ID missing'
*       '404':
*         description: Service not found
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errCode:
*                   type: integer
*                   example: 2
*                 message:
*                   type: string
*                   example: 'Service not found'
*       '500':
*         description: Server error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errCode:
*                   type: integer
*                   example: 1
*                 message:
*                   type: string
*                   example: 'Server error'
*/
  router.put("/service", verifyToken, adminController.handleDeleteService);

  /**
   * @swagger
   * /api/estimate-diamond-value-by-certificate:
   *   post:
   *     summary: Estimate diamond value by Certificate ID
   *     description: Calculate the estimated value of a diamond based on its Certificate ID
   *     tags: [Diamond]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               certificateId:
   *                 type: string
   *                 example: 'CERT12345'
   *                 description: Certificate ID of the diamond
   *     responses:
   *       '200':
   *         description: Successfully estimated diamond value
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errCode:
   *                   type: integer
   *                   example: 0
   *                 message:
   *                   type: string
   *                   example: 'Estimated diamond value'
   *                 estimatedPrice:
   *                   type: number
   *                   example: 1500
   *       '400':
   *         description: Invalid input parameters or Certificate ID missing
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errCode:
   *                   type: integer
   *                   example: 1
   *                 message:
   *                   type: string
   *                   example: 'Invalid input parameters or Certificate ID missing'
   *       '404':
   *         description: Diamond not found with the provided Certificate ID
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errCode:
   *                   type: integer
   *                   example: 2
   *                 message:
   *                   type: string
   *                   example: 'Diamond not found'
   *       '500':
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errCode:
   *                   type: integer
   *                   example: 1
   *                 message:
   *                   type: string
   *                   example: 'Server error'
   */
  router.post("/estimate-diamond-value-by-certificate", userController.estimateDiamondValueByCertificate);

  /**
   * @swagger
   * /api/feedback:
   *   post:
   *     summary: Submit feedback
   *     description: Customer submits feedback after using a service
   *     tags: [User]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               requestId:
   *                 type: integer
   *                 example: 1
   *               customerName:
   *                 type: string
   *                 example: 'John Doe'
   *               email:
   *                 type: string
   *                 example: 'john.doe@example.com'
   *               feedbackText:
   *                 type: string
   *                 example: 'Great service!'
   *     responses:
   *       '200':
   *         description: Feedback submitted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errCode:
   *                   type: integer
   *                   example: 0
   *                 message:
   *                   type: string
   *                   example: 'Feedback submitted successfully'
   *       '400':
   *         description: Invalid input parameters or missing fields
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errCode:
   *                   type: integer
   *                   example: 1
   *                 message:
   *                   type: string
   *                   example: 'Invalid input parameters or missing fields'
   *       '500':
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errCode:
   *                   type: integer
   *                   example: 1
   *                 message:
   *                   type: string
   *                   example: 'Server error'
   */
  router.post("/feedback", verifyToken, userController.handleFeedback);

  /**
* @swagger
* /api/staff:
*   get:
*     summary: Retrieve staff profiles
*     description: Admin and Manager can view the staff’s profiles
*     tags: [Staff Management]
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: A list of staff profiles
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   id:
*                     type: integer
*                     example: 1
*                   username:
*                     type: string
*                     example: "johndoe"
*                   firstName:
*                     type: string
*                     example: "John"
*                   lastName:
*                     type: string
*                     example: "Doe"
*                   email:
*                     type: string
*                     example: "johndoe@example.com"
*                   phone:
*                     type: string
*                     example: "123-456-7890"
*                   createdAt:
*                     type: string
*                     format: date-time
*                     example: "2023-01-01T00:00:00Z"
*                   status:
*                     type: integer
*                     example: 1
*                   role:
*                     type: string
*                     example: "Manager"
*       403:
*         description: Forbidden
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errCode:
*                   type: integer
*                   example: 1
*                 message:
*                   type: string
*                   example: "Forbidden"
*       500:
*         description: Server error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errCode:
*                   type: integer
*                   example: -1
*                 message:
*                   type: string
*                   example: "Error from server"
*/
  router.get("/staff", verifyToken, managerController.handleGetStaff);

  /**
* @swagger
* /api/take-request:
*   post:
*     summary: Approve valuation request
*     description: Consulting Staff can approve a valuation request
*     tags: [Requests]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               requestId:
*                 type: integer
*                 example: 1
*     responses:
*       200:
*         description: Valuation request approved successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errCode:
*                   type: integer
*                   example: 0
*                 message:
*                   type: string
*                   example: 'Valuation request approved successfully'
*       400:
*         description: Invalid input parameters or Request ID missing
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errCode:
*                   type: integer
*                   example: 1
*                 message:
*                   type: string
*                   example: 'Invalid input parameters or Request ID missing'
*       404:
*         description: Valuation request not found
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errCode:
*                   type: integer
*                   example: 2
*                 message:
*                   type: string
*                   example: 'Valuation request not found'
*       500:
*         description: Server error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errCode:
*                   type: integer
*                   example: -1
*                 message:
*                   type: string
*                   example: 'Error from server'
*/
  router.post("/take-request", verifyToken, staffController.handleApproveValuationRequest);

  /**
* @swagger
* /api/print-valuation-report:
*   get:
*     summary: Print valuation report
*     description: Consulting Staff or Valuation Staff can print the valuation report based on the request ID
*     tags: [Valuation Management]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: query
*         name: requestId
*         schema:
*           type: integer
*         required: true
*         description: ID of the request for which the valuation report should be printed
*         example: 1
*     responses:
*       200:
*         description: Valuation report fetched successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 requestId:
*                   type: integer
*                   example: 1
*                 requestImage:
*                   type: string
*                   example: "image_url"
*                 note:
*                   type: string
*                   example: "Customer's note"
*                 createdDate:
*                   type: string
*                   format: date-time
*                   example: "2024-06-20T10:30:00Z"
*                 appointmentDate:
*                   type: string
*                   format: date-time
*                   example: "2024-06-20T10:45:00Z"
*                 paymentStatus:
*                   type: string
*                   example: "Paid"
*                 customerUsername:
*                   type: string
*                   example: "customer_username"
*                 customerFirstName:
*                   type: string
*                   example: "John"
*                 customerLastName:
*                   type: string
*                   example: "Doe"
*                 certificateId:
*                   type: string
*                   example: "ABCD1234"
*                 caratWeight:
*                   type: number
*                   example: 1.5
*                 cut:
*                   type: string
*                   example: "Excellent"
*                 color:
*                   type: string
*                   example: "D"
*                 clarity:
*                   type: string
*                   example: "IF"
*                 shape:
*                   type: string
*                   example: "Round"
*                 price:
*                   type: number
*                   example: 5000
*                 companyName:
*                   type: string
*                   example: "Valuation Company"
*                 valuationDate:
*                   type: string
*                   format: date-time
*                   example: "2024-06-20T11:00:00Z"
*       400:
*         description: Invalid input parameters or Request ID missing
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errCode:
*                   type: integer
*                   example: 1
*                 message:
*                   type: string
*                   example: 'Invalid input parameters or Request ID missing'
*       404:
*         description: Valuation report not found
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errCode:
*                   type: integer
*                   example: 2
*                 message:
*                   type: string
*                   example: 'Valuation report not found'
*       500:
*         description: Server error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errCode:
*                   type: integer
*                   example: -1
*                 message:
*                   type: string
*                   example: 'Error from server'
*/
  router.get("/print-valuation-report", verifyToken, staffController.handlePrintValuationReport);

  /**
   * @swagger
   * /api/request-approval:
   *   post:
   *     summary: Request approval for sealing commitment form or pledge form
   *     description: Consulting Staff initiates a request for Manager approval.
   *     tags: [Diamond Management]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               requestId:
   *                 type: integer
   *                 description: ID of the request for approval
   *                 example: 1
   *               requestType:
   *                 type: string
   *                 description: Type of request (SealingCommitmentForm, PledgeForm)
   *                 example: 'Sealing'
   *               description:
   *                 type: string
   *                 description: Description of the request
   *                 example: 'Requesting approval for sealing form.'
   *     responses:
   *       200:
   *         description: Approval request submitted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errCode:
   *                   type: integer
   *                   example: 0
   *                 message:
   *                   type: string
   *                   example: 'Approval request submitted successfully'
   *       400:
   *         description: Invalid input parameters or Request ID or Request Type missing
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errCode:
   *                   type: integer
   *                   example: 1
   *                 message:
   *                   type: string
   *                   example: 'Invalid input parameters or Request ID or Request Type missing'
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errCode:
   *                   type: integer
   *                   example: -1
   *                 message:
   *                   type: string
   *                   example: 'Error from server'
   */
  router.post("/request-approval", verifyToken, staffController.handleRequestApproval);

  /**
 * @swagger
 * /api/approve-request:
 *   put:
 *     summary: Approve or reject a request
 *     description: Manager approves or rejects a request for sealing commitment form or pledge form.
 *     tags: [Diamond Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               approvalId:
 *                 type: integer
 *                 description: ID of the approval request
 *                 example: 1
 *               status:
 *                 type: string
 *                 description: Status of approval (Approved, Rejected)
 *                 example: 'Approved'
 *     responses:
 *       200:
 *         description: Approval status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errCode:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: 'Approval status updated successfully'
 *       400:
 *         description: Invalid input parameters or Approval ID missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errCode:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: 'Invalid input parameters or Approval ID missing'
 *       404:
 *         description: Approval request not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errCode:
 *                   type: integer
 *                   example: 2
 *                 message:
 *                   type: string
 *                   example: 'Approval request not found'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errCode:
 *                   type: integer
 *                   example: -1
 *                 message:
 *                   type: string
 *                   example: 'Error from server'
 */
  router.put("/approve-request", verifyToken, managerController.handleApproveRequest);

  /**
   * @swagger
   * /api/receive-diamond:
   *   post:
   *     summary: Receive diamond from customer
   *     description: Allows Consulting and Valuation staff to receive diamonds from customers. The received diamond information is updated in the database, and the process is logged.
   *     tags: [Diamond Management]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               requestId:
   *                 type: integer
   *                 description: ID of the request associated with the diamond.
   *                 example: 1
   *     responses:
   *       '200':
   *         description: Diamond received successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errCode:
   *                   type: integer
   *                   example: 0
   *                 message:
   *                   type: string
   *                   example: 'Diamond received successfully'
   *       '400':
   *         description: Invalid input parameters or missing required fields
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errCode:
   *                   type: integer
   *                   example: 1
   *                 message:
   *                   type: string
   *                   example: 'Invalid input parameters or missing required fields'
   *       '404':
   *         description: Request not found or invalid request ID
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errCode:
   *                   type: integer
   *                   example: 2
   *                 message:
   *                   type: string
   *                   example: 'Request not found or invalid request ID'
   *       '500':
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errCode:
   *                   type: integer
   *                   example: 1
   *                 message:
   *                   type: string
   *                   example: 'Server error'
   */
  router.post("/receive-diamond", verifyToken, staffController.handleReceiveDiamond);

  /**
* @swagger
* /api/send-valuation-result:
*   post:
*     summary: Send valuation result to consulting staff
*     description: Valuation staff send the valuation result to consulting staff.
*     tags: [Valuation Management]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               requestId:
*                 type: integer
*                 description: ID of the request associated with the valuation result.
*                 example: 1
*               valuationResultId:
*                 type: integer
*                 description: ID of the valuation result.
*                 example: 2
*     responses:
*       '200':
*         description: Valuation result sent successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errCode:
*                   type: integer
*                   example: 0
*                 message:
*                   type: string
*                   example: 'Valuation result sent successfully'
*       '400':
*         description: Invalid input parameters or missing required fields
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errCode:
*                   type: integer
*                   example: 1
*                 message:
*                   type: string
*                   example: 'Invalid input parameters or missing required fields'
*       '404':
*         description: Request not found or invalid request ID
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errCode:
*                   type: integer
*                   example: 2
*                 message:
*                   type: string
*                   example: 'Request not found or invalid request ID'
*       '500':
*         description: Server error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errCode:
*                   type: integer
*                   example: 1
*                 message:
*                   type: string
*                   example: 'Server error'
*/
  router.post("/send-valuation-result", verifyToken, staffController.handleSendValuationResult);

  /**
  * @swagger
  * /api/payment:
  *  put:
  *   summary: Handle payment for a request
  *   description: Handle payment for a specific request identified by its ID
  *   tags:
  *      - Payment
  *   security:
  *     - bearerAuth: []
  *   requestBody:
  *     required: true
  *     content:
  *       application/json:
  *         schema:
  *           type: object
  *           properties:
  *             requestId:
  *               type: number
  *   responses:
  *     "200":
  *       description: Payment successful
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               errCode:
  *                 type: integer
  *               message:
  *                 type: string
  *     "401":
  *       description: Unauthorized
  *     "404":
  *       description: Request not found
  */
  router.put("/payment", verifyToken, userController.handlePayment);

  /**
* @swagger
* /api/send-valuation-result-customer:
*   post:
*     summary: Send valuation result to customer
*     description: Allows Consulting Staff to send the valuation result to the customer after the valuation is complete.
*     tags: [Valuation Management]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               requestId:
*                 type: integer
*                 description: ID of the request associated with the valuation.
*                 example: 1
*     responses:
*       '200':
*         description: Valuation result sent to customer successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errCode:
*                   type: integer
*                   example: 0
*                 message:
*                   type: string
*                   example: 'Valuation result sent to customer successfully'
*       '400':
*         description: Invalid input parameters or missing required fields
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errCode:
*                   type: integer
*                   example: 1
*                 message:
*                   type: string
*                   example: 'Invalid input parameters or missing required fields'
*       '404':
*         description: Request not found or invalid request ID
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errCode:
*                   type: integer
*                   example: 2
*                 message:
*                   type: string
*                   example: 'Request not found or invalid request ID'
*       '500':
*         description: Server error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errCode:
*                   type: integer
*                   example: 1
*                 message:
*                   type: string
*                   example: 'Server error'
*/
  router.post("/send-valuation-result-customer", verifyToken, staffController.handleSendValuationResultToCustomer);

  /**
  * @swagger
  * /api/send-diamond-to-valuationStaff:
  *   post:
  *     summary: Send diamond's sample to valuation staff
  *     description: Allows Consulting Staff to send the diamond's sample taken from the customer to the valuation staff.
  *     tags: [Diamond Management]
  *     security:
  *       - bearerAuth: []
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               requestId:
  *                 type: integer
  *                 description: ID of the request associated with the diamond.
  *                 example: 1
  *     responses:
  *       '200':
  *         description: Diamond sent to valuation staff successfully
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 errCode:
  *                   type: integer
  *                   example: 0
  *                 message:
  *                   type: string
  *                   example: 'Diamond sent to valuation staff successfully'
  *       '400':
  *         description: Invalid input parameters or missing required fields
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 errCode:
  *                   type: integer
  *                   example: 1
  *                 message:
  *                   type: string
  *                   example: 'Invalid input parameters or missing required fields'
  *       '404':
  *         description: Request not found or invalid request ID
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 errCode:
  *                   type: integer
  *                   example: 2
  *                 message:
  *                   type: string
  *                   example: 'Request not found or invalid request ID'
  *       '500':
  *         description: Server error
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 errCode:
  *                   type: integer
  *                   example: 1
  *                 message:
  *                   type: string
  *                   example: 'Server error'
  */
  router.post("/send-diamond-to-valuationStaff", verifyToken, staffController.handleSendDiamondToValuation);

  /**
  * @swagger
  * /api/approve-commitment:
  *   post:
  *     summary: Approve commitment to receive valuation sample
  *     description: Allows the manager to approve the commitment to receive the valuation sample for the diamond sample of the customer.
  *     tags: [Diamond Management]
  *     security:
  *       - bearerAuth: []
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               commitmentId:
  *                 type: integer
  *                 description: ID of the commitment request.
  *                 example: 1
  *               status:
  *                 type: string
  *                 description: Approval status (e.g., 'approved', 'rejected').
  *                 example: 'approved'
  *     responses:
  *       '200':
  *         description: Commitment approved successfully
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 errCode:
  *                   type: integer
  *                   example: 0
  *                 message:
  *                   type: string
  *                   example: 'Commitment approved successfully'
  *       '400':
  *         description: Invalid input parameters or missing required fields
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 errCode:
  *                   type: integer
  *                   example: 1
  *                 message:
  *                   type: string
  *                   example: 'Invalid input parameters or missing required fields'
  *       '404':
  *         description: Commitment not found or invalid commitment ID
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 errCode:
  *                   type: integer
  *                   example: 2
  *                 message:
  *                   type: string
  *                   example: 'Commitment not found or invalid commitment ID'
  *       '500':
  *         description: Server error
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 errCode:
  *                   type: integer
  *                   example: 1
  *                 message:
  *                   type: string
  *                   example: 'Server error'
  */
  router.post("/approve-commitment", verifyToken, staffController.handleApproveCommitment);

  /**
  * @swagger
  * /api/completePayment/{id}:
  *   post:
  *     summary: Complete payment for a request
  *     description: Complete the payment for a specific request identified by its ID
  *     tags:
  *       - Payment
  *     parameters:
  *       - in: path
  *         name: id
  *         description: ID of the request
  *         required: true
  *         schema:
  *           type: integer
  *     security:
  *       - bearerAuth: []
  *     responses:
  *       '200':
  *         description: Payment completed successfully
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 errCode:
  *                   type: integer
  *                   description: Error code (0 for success, non-zero for failure)
  *                 message:
  *                   type: string
  *                   description: Message indicating the result of the operation
  *       '401':
  *         description: Unauthorized, user not authenticated
  *       '404':
  *         description: Request not found
  *       '500':
  *         description: Internal server error, failed to complete payment
  */
  router.post("/completePayment/:id", verifyToken, userController.handleCompletePayment);

  /**
  * @swagger
  * /api/changeProcess/{id}:
  *  put:
  *   summary: Change process status
  *   description: Change process status
  *   tags:
  *     - Staff
  *   parameters:
  *     - in: path
  *       name: id
  *       schema:
  *         type: integer
  *       required: true
  *       description: The request ID
  *   requestBody:
  *     required: true
  *     content:
  *       application/json:
  *         schema:
  *           type: object
  *           properties:
  *             processId:
  *               type: integer
  *   responses:
  *     "200":
  *       description: Process status changed successfully
  *     "401":
  *       description: Unauthorized
  */
  router.put("/changeProcess/:id", verifyToken, staffController.handleChangeProcess);

  /**
  * @swagger
  * /api/valuation/{id}:
  *   put:
  *     summary: Update diamond valuation
  *     description: Update the valuation details of a diamond.
  *     tags:
  *       - Staff
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: integer
  *         required: true
  *         description: The ID of the request
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               proportions:
  *                 type: string
  *                 description: The proportions of the diamond
  *                 example: "Ideal"
  *               diamondOrigin:
  *                 type: string
  *                 description: The origin of the diamond
  *                 example: "Africa"
  *               caratWeight:
  *                 type: number
  *                 format: float
  *                 description: The carat weight of the diamond
  *                 example: 1.5
  *               measurements:
  *                 type: string
  *                 description: The measurements of the diamond
  *                 example: "6.5 x 6.5 x 4.0 mm"
  *               polish:
  *                 type: string
  *                 description: The polish of the diamond
  *                 example: "Excellent"
  *               flourescence:
  *                 type: string
  *                 description: The fluorescence of the diamond
  *                 example: "None"
  *               color:
  *                 type: string
  *                 description: The color of the diamond
  *                 example: "D"
  *               cut:
  *                 type: string
  *                 description: The cut of the diamond
  *                 example: "Round"
  *               clarity:
  *                 type: string
  *                 description: The clarity of the diamond
  *                 example: "VS1"
  *               symmetry:
  *                 type: string
  *                 description: The symmetry of the diamond
  *                 example: "Excellent"
  *               shape:
  *                 type: string
  *                 description: The shape of the diamond
  *                 example: "Round"
  *     responses:
  *       200:
  *         description: Valuation updated successfully
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 errCode:
  *                   type: integer
  *                   example: 0
  *                 message:
  *                   type: string
  *                   example: "Valuation successful"
  *       401:
  *         description: Unauthorized
  *       400:
  *         description: Bad Request
  */
  router.put("/valuation/:id", verifyToken, staffController.handleValuation);

  /**
  * @swagger
  * /api/users:
  *  get:
  *   summary: Get all users
  *   description: Get all users
  *   tags:
  *      - Manager User
  *   responses:
  *     "200":
  *       description: A list of users
  *       content:
  *         application/json:
  *           schema:
  *             type: array
  *             items:
  *               type: object
  *               properties:
  *                 id:
  *                   type: integer
  *                 username:
  *                   type: string
  *                 firstName:
  *                   type: string
  *                 lastName:
  *                   type: string
  *                 email:
  *                   type: string
  *                 phone:
  *                   type: string
  *                 roleId:
  *                   type: integer
  *                 status:
  *                   type: integer
  *     "401":
  *       description: Unauthorized
  */
  router.get("/users", verifyToken, adminController.handleGetAllUsers);

  /**
  * @swagger
  * /api/users/{id}:
  *  get:
  *   summary: Get user by ID
  *   description: Get user by ID
  *   tags:
  *      - Manager User
  *   parameters:
  *     - in: path
  *       name: id
  *       schema:
  *         type: integer
  *       required: true
  *       description: The user ID
  *   responses:
  *     "200":
  *       description: User data
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               id:
  *                 type: integer
  *               username:
  *                 type: string
  *               firstName:
  *                 type: string
  *               lastName:
  *                 type: string
  *               email:
  *                 type: string
  *               phone:
  *                 type: string
  *               roleId:
  *                 type: integer
  *               status:
  *                 type: integer
  *     "401":
  *       description: Unauthorized
  */
  router.get("/users/:id", verifyToken, adminController.handleGetUserById);

  /**
  * @swagger
  * /api/users:
  *  post:
  *   summary: Create a new user
  *   description: Create a new user
  *   tags:
  *     - Manager User
  *   requestBody:
  *     required: true
  *     content:
  *       application/json:
  *         schema:
  *           type: object
  *           properties:
  *             username:
  *               type: string
  *             password:
  *               type: string
  *             firstName:
  *               type: string
  *             lastName:
  *               type: string
  *             email:
  *               type: string
  *             phone:
  *               type: string
  *             roleId:
  *               type: integer
  *   responses:
  *     "200":
  *       description: User created successfully
  *     "401":
  *       description: Unauthorized
  */
  router.post("/users", verifyToken, adminController.handleCreateNewUser);

  /**
  * @swagger
  * /api/users:
  *  put:
  *   summary: Update user
  *   description: Update user
  *   tags:
  *     - Manager User
  *   requestBody:
  *     required: true
  *     content:
  *       application/json:
  *         schema:
  *           type: object
  *           properties:
  *             username:
  *               type: string
  *             password:
  *               type: string
  *             firstName:
  *               type: string
  *             lastName:
  *               type: string
  *             email:
  *               type: string
  *             phone:
  *               type: string
  *   responses:
  *     "200":
  *       description: User updated successfully
  *     "401":
  *       description: Unauthorized
  */
  router.put("/users", verifyToken, adminController.handleUpdateUser);

  /**
  * @swagger
  * /api/deleteUser:
  *  put:
  *   summary: Delete user
  *   description: Delete user
  *   tags:
  *     - Manager User
  *   parameters:
  *        - in: query
  *          name: username
  *          schema:
  *            type: string
  *          required: true
  *          description: The username of the user to be deleted
  *   requestBody:
  *     required: true
  *     content:
  *       application/json:
  *         schema:
  *           type: object
  *           properties:
  *             status:
  *               type: integer
  *   responses:
  *     "200":
  *       description: User deleted successfully
  *     "401":
  *       description: Unauthorized
  */
  router.put("/deleteUser", verifyToken, adminController.handleDeleteUser);

  /**
  * @swagger
  * /api/diamonds:
  *  get:
  *   summary: Get all diamonds
  *   description: Get all diamonds
  *   tags:
  *     - Admin
  *   responses:
  *     "200":
  *       description: A list of diamonds
  *       content:
  *         application/json:
  *           schema:
  *             type: array
  *             items:
  *               type: object
  *               properties:
  *                 id:
  *                   type: integer
  *                 proportions:
  *                   type: string
  *                 diamondOrigin:
  *                   type: string
  *                 caratWeight:
  *                   type: number
  *                 measurements:
  *                   type: string
  *                 polish:
  *                   type: string
  *                 flourescence:
  *                   type: string
  *                 color:
  *                   type: string
  *                 cut:
  *                   type: string
  *                 clarity:
  *                   type: string
  *                 symmetry:
  *                   type: string
  *     "401":
  *       description: Unauthorized
  */
  router.get("/diamonds", verifyToken, adminController.handleGetDiamonds);

  /**
  * @swagger
  * /api/requests:
  *  get:
  *   summary: Get all requests
  *   description: Get all requests
  *   tags:
  *      - Admin
  *   responses:
  *     "200":
  *       description: A list of requests
  *       content:
  *         application/json:
  *           schema:
  *             type: array
  *             items:
  *               type: object
  *               properties:
  *                 id:
  *                   type: integer
  *                 proportions:
  *                   type: string
  *                 diamondOrigin:
  *                   type: string
  *                 caratWeight:
  *                   type: number
  *                 measurements:
  *                   type: string
  *                 polish:
  *                   type: string
  *                 flourescence:
  *                   type: string
  *                 color:
  *                   type: string
  *                 cut:
  *                   type: string
  *                 clarity:
  *                   type: string
  *                 symmetry:
  *                   type: string
  *                 shape:
  *                   type: string
  *                 requestImage:
  *                   type: string
  *                 note:
  *                   type: string
  *                 userId:
  *                   type: integer
  *                 processId:
  *                   type: integer
  *     "401":
  *       description: Unauthorized
  */
  router.get("/requests", verifyToken, adminController.handleGetRequests);

  /**
  * @swagger
  * /api/requests/{id}:
  *  get:
  *   summary: Get request by ID
  *   description: Get request by ID
  *   tags:
  *      - Admin
  *   parameters:
  *     - in: path
  *       name: id
  *       schema:
  *         type: integer
  *       required: true
  *       description: The request ID
  *   responses:
  *     "200":
  *       description: Request data
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               id:
  *                 type: integer
  *               proportions:
  *                 type: string
  *               diamondOrigin:
  *                 type: string
  *               caratWeight:
  *                 type: number
  *               measurements:
  *                 type: string
  *               polish:
  *                 type: string
  *               flourescence:
  *                 type: string
  *               color:
  *                 type: string
  *               cut:
  *                 type: string
  *               clarity:
  *                 type: string
  *               symmetry:
  *                 type: string
  *               shape:
  *                 type: string
  *               requestImage:
  *                 type: string
  *               note:
  *                 type: string
  *               userId:
  *                 type: integer
  *               processId:
  *                 type: integer
  *     "401":
  *       description: Unauthorized
  */
  router.get("/requests/:id", verifyToken, adminController.handleGetRequestById);

  /**
  * @swagger
  * /api/results:
  *  get:
  *   summary: Get all results
  *   description: Get all results
  *   tags:
  *     - Admin
  *   responses:
  *     "200":
  *       description: A list of results
  *       content:
  *         application/json:
  *           schema:
  *             type: array
  *             items:
  *               type: object
  *               properties:
  *                 id:
  *                   type: integer
  *                 price:
  *                   type: number
  *                 companyName:
  *                   type: string
  *                 dateValued:
  *                   type: string
  *                 requestID:
  *                   type: integer
  *                 proportions:
  *                   type: string
  *                 diamondOrigin:
  *                   type: string
  *                 caratWeight:
  *                   type: number
  *                 measurements:
  *                   type: string
  *                 polish:
  *                   type: string
  *                 flourescence:
  *                   type: string
  *                 color:
  *                   type: string
  *                 cut:
  *                   type: string
  *                 clarity:
  *                   type: string
  *                 symmetry:
  *                   type: string
  *                 shape:
  *                   type: string
  *     "401":
  *       description: Unauthorized
  */
  router.get("/results", verifyToken, adminController.handleGetResults);

  /**
  * @swagger
  * /api/registerMail:
  *   post:
  *     summary: Subscribe to the newsletter
  *     description: Subscribe to receive the latest offers, news, and promotions about diamonds.
  *     tags:
  *       - User
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               email:
  *                 type: string
  *                 format: email
  *                 example: "customer@example.com"
  *     responses:
  *       '200':
  *         description: Subscription successful
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 errCode:
  *                   type: integer
  *                   example: 0
  *                 message:
  *                   type: string
  *                   example: "Subscription successful, email sent."
  *       '400':
  *         description: Invalid email format
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 errCode:
  *                   type: integer
  *                   example: 1
  *                 message:
  *                   type: string
  *                   example: "Invalid email format."
  */
  router.post("/registerMail", userController.handleRegisterMail);

  /**
  * @swagger
  * /api/create_payment_url:
  *   post:
  *     summary: Create Payment URL
  *     description: Generates a URL for initiating a VNPAY payment.
  *     tags:
  *       - Payment
  *     requestBody:
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               amount:
  *                 type: integer
  *                 example: 100000
  *                 description: Amount to be paid.
  *               bankCode:
  *                 type: string
  *                 example: 
  *                 description: Bank code for the transaction.
  *               language:
  *                 type: string
  *                 example: vn
  *                 description: Language for the transaction.
  *     responses:
  *       '302':
  *         description: Redirects to the payment URL.
  *       '500':
  *         description: Server error.
  */
  router.post('/create_payment_url', userController.handleCreatePaymentUrl);

  /**
  * @swagger
  * /api/vnpay_return:
  *   get:
  *     summary: VNPAY Return
  *     description: Handles the return URL after payment is processed.
  *     tags:
  *       - Payment
  *     parameters:
  *       - name: vnp_SecureHash
  *         in: query
  *         required: true
  *         schema:
  *           type: string
  *         description: Secure hash for the transaction.
  *       - name: other
  *         in: query
  *         schema:
  *           type: string
  *         description: Other parameters returned by VNPAY.
  *     responses:
  *       '200':
  *         description: Payment result.
  *         content:
  *           text/html:
  *             schema:
  *               type: string
  *       '500':
  *         description: Server error.
  */
  router.get('/vnpay_return', userController.handleVnPayReturn);

  /**
  * @swagger
  * /api/vnpay_ipn:
  *   get:
  *     summary: VNPAY IPN
  *     description: Handles the IPN (Instant Payment Notification) from VNPAY.
  *     tags:
  *       - Payment
  *     parameters:
  *       - name: vnp_SecureHash
  *         in: query
  *         required: true
  *         schema:
  *           type: string
  *         description: Secure hash for the transaction.
  *       - name: other
  *         in: query
  *         schema:
  *           type: string
  *         description: Other parameters returned by VNPAY.
  *     responses:
  *       '200':
  *         description: Notification result.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 RspCode:
  *                   type: string
  *                   example: '00'
  *                 Message:
  *                   type: string
  *                   example: 'Success'
  *       '500':
  *         description: Server error.
  */
  router.get('/vnpay_ipn', userController.handleVnPayIPN);

  /**
  * @swagger
  * /api/querydr:
  *   post:
  *     summary: Query Transaction
  *     description: Queries the status of a transaction.
  *     tags:
  *       - Payment
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               orderId:
  *                 type: string
  *                 description: Order ID.
  *                 example: "12345678"
  *               transDate:
  *                 type: string
  *                 description: Transaction date.
  *                 example: "20240610123000"
  *     responses:
  *       '200':
  *         description: Query result.
  *       '500':
  *         description: Server error.
  */
  router.post('/querydr', userController.handleQueryDR);

  /**
  * @swagger
  * /api/refund:
  *   post:
  *     summary: Refund Transaction
  *     description: Requests a refund for a transaction.
  *     tags:
  *       - Payment
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               orderId:
  *                 type: string
  *                 description: Order ID.
  *                 example: "12345678"
  *               transDate:
  *                 type: string
  *                 description: Transaction date.
  *                 example: "20240610123000"
  *               amount:
  *                 type: number
  *                 description: Amount to refund.
  *                 example: 100000
  *               transType:
  *                 type: string
  *                 description: Transaction type.
  *                 example: "refund"
  *               user:
  *                 type: string
  *                 description: User requesting the refund.
  *                 example: "admin"
  *     responses:
  *       '200':
  *         description: Refund result.
  *       '500':
  *         description: Server error.
  */
  router.post('/refund', userController.handleRefund);

  /**
  * @swagger
  * /api/paypal:
  *   post:
  *     summary: Create a PayPal payment
  *     tags: [Payment]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               requestId:
  *                 type: integer
  *                 description: ID of the request to be paid
  *                 example: 1
  *               amount:
  *                 type: string
  *                 description: Amount to be paid
  *                 example: "100000"
  *     responses:
  *       200:
  *         description: Payment created successfully
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 errCode:
  *                   type: integer
  *                   example: 0
  *                 message:
  *                   type: string
  *                   example: Success
  *                 data:
  *                   type: string
  *                   description: URL to redirect user for payment approval
  *                   example: "https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-60U79048BN771701L"
  */
  router.post('/paypal', userController.handlePaypal);

  /**
  * @swagger
  * /api/paypalReturn:
  *   get:
  *     summary: Execute a PayPal payment
  *     tags: [Payment]
  *     parameters:
  *       - in: query
  *         name: paymentId
  *         schema:
  *           type: string
  *         required: true
  *         description: PayPal Payment ID
  *       - in: query
  *         name: PayerID
  *         schema:
  *           type: string
  *         required: true
  *         description: PayPal Payer ID
  *     responses:
  *       200:
  *         description: Payment executed successfully
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/PaypalResponse'
  */
  router.get('/paypalReturn', userController.handlePaypalReturn);

  /**
   * @swagger
   * /api/getRequestByUser:
   *  get:
   *   summary: Get all requests by a user
   *   description: Retrieve all requests made by the authenticated user.
   *   tags:
   *     - User
   *   security:
   *     - bearerAuth: []
   *   responses:
   *     "200":
   *       description: Success
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               errCode:
   *                 type: integer
   *                 example: 0
   *               message:
   *                 type: string
   *                 example: Success
   *               data:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: integer
   *                       example: 1
   *                     requestImage:
   *                       type: string
   *                       example: "https://example.com/request-image.jpg"
   *                     createdDate:
   *                       type: string
   *                       format: date-time
   *                       example: "2023-06-18T15:53:00"
   *                     paymentStatus:
   *                       type: string
   *                       example: "Pending"
   *                     serviceName:
   *                       type: string
   *                       example: "Diamond Cleaning"
   *     "401":
   *       description: Unauthorized
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               errCode:
   *                 type: integer
   *                 example: 1
   *               message:
   *                 type: string
   *                 example: "Unauthorized"
   *     "500":
   *       description: Internal Server Error
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               errCode:
   *                 type: integer
   *                 example: 1
   *               message:
   *                 type: string
   *                 example: "Internal Server Error"
   */
  router.get('/getRequestByUser', verifyToken, userController.handleGetRequestByUser);

  /**
   * @swagger
   * /api/countUser:
   *  get:
   *   summary: Count users
   *   description: Count users
   *   tags:
   *     - Admin
   *   responses:
   *     "200":
   *       description: User count retrieved successfully
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               count:
   *                 type: integer
   *     "401":
   *       description: Unauthorized
   */
  router.get("/countUser", verifyToken, adminController.handleCountUser);

  /**
* @swagger
* /api/countRequest:
*  get:
*   summary: Count requests
*   description: Count requests
*   tags:
*     - Admin
*   responses:
*     "200":
*       description: Request count retrieved successfully
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               count:
*                 type: integer
*     "401":
*       description: Unauthorized
*/
  router.get("/countRequest", verifyToken, adminController.handleCountRequest);

  /**
  * @swagger
  * /api/countDiamond:
  *  get:
  *   summary: Count diamonds
  *   description: Count diamonds
  *   tags:
  *     - Admin
  *   responses:
  *     "200":
  *       description: Diamond count retrieved successfully
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               count:
  *                 type: integer
  *     "401":
  *       description: Unauthorized
  */
  router.get("/countDiamond", verifyToken, adminController.handleCountDiamond);

  /**
* @swagger
* /api/profit:
*  get:
*   summary: Get profit
*   description: Get profit
*   tags:
*     - Admin
*   responses:
*     "200":
*       description: Profit retrieved successfully
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               errCode:
*                 type: integer
*               message:
*                 type: string
*                 example: "OK"
*               profit:
*                 type: number
*                 example: 1000000
*     "401":
*       description: Unauthorized
*/
  router.get("/profit", verifyToken, adminController.handleGetProfit);

  /**
 * @swagger
 * /api/new-request:
 *   get:
 *     summary: Get new requests for staff
 *     description: Retrieve a list of new requests that have not been assigned to any receiver yet.
 *     tags:
 *       - Requests
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Get new request successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errCode:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: Get new request successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       requestId:
 *                         type: integer
 *                         example: 1
 *                       requestImage:
 *                         type: string
 *                         example: "http://example.com/image.jpg"
 *                       note:
 *                         type: string
 *                         example: "Customer note"
 *                       createdDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-06-20T12:00:00Z"
 *                       paymentStatus:
 *                         type: string
 *                         example: "Paid"
 *                       serviceName:
 *                         type: string
 *                         example: "Basic Valuation"
 *                       status:
 *                         type: string
 *                         example: "Pending"
 *                       processStatus:
 *                         type: string
 *                         example: "Unprocessed"
 *       500:
 *         description: Error from server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errCode:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: Error from server
 */
  router.get("/new-request", verifyToken, staffController.handleGetNewRequest);

  /**
   * @swagger
   * /api/take-request:
   *   get:
   *     summary: Get taken requests by staff
   *     description: Retrieve a list of requests that have been taken by the logged-in staff member.
   *     tags:
   *       - Requests
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Get taken requests successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errCode:
   *                   type: integer
   *                   example: 0
   *                 message:
   *                   type: string
   *                   example: Get taken requests successfully
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       requestId:
   *                         type: integer
   *                         example: 1
   *                       requestImage:
   *                         type: string
   *                         example: "http://example.com/image.jpg"
   *                       note:
   *                         type: string
   *                         example: "Customer note"
   *                       createdDate:
   *                         type: string
   *                         format: date-time
   *                         example: "2023-06-20T12:00:00Z"
   *                       paymentStatus:
   *                         type: string
   *                         example: "Paid"
   *                       serviceName:
   *                         type: string
   *                         example: "Basic Valuation"
   *                       status:
   *                         type: string
   *                         example: "Pending"
   *                       processStatus:
   *                         type: string
   *                         example: "Unprocessed"
   *       500:
   *         description: Error from server
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errCode:
   *                   type: integer
   *                   example: -1
   *                 message:
   *                   type: string
   *                   example: Error from server
   */
  router.get("/take-request", verifyToken, staffController.handleGetTakeRequest);

  /**
   * @swagger
   * /api/appointment:
   *   put:
   *     summary: Book an appointment for a request
   *     description: Updates the appointment date for a specific request and changes its process status to "Booked Appointment".
   *     tags:
   *       - Requests
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               id:
   *                 type: integer
   *                 example: 1
   *               appointmentDate:
   *                 type: string
   *                 format: date-time
   *                 example: "2023-06-25T10:00:00Z"
   *     responses:
   *       200:
   *         description: Appointment booked successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errCode:
   *                   type: integer
   *                   example: 0
   *                 message:
   *                   type: string
   *                   example: Appointment booked successfully
   *       400:
   *         description: Invalid input parameters or missing required fields
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errCode:
   *                   type: integer
   *                   example: 1
   *                 message:
   *                   type: string
   *                   example: Invalid input parameters or missing required fields
   *       404:
   *         description: Request not found or invalid request ID
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errCode:
   *                   type: integer
   *                   example: 2
   *                 message:
   *                   type: string
   *                   example: Request not found or invalid request ID
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errCode:
   *                   type: integer
   *                   example: 1
   *                 message:
   *                   type: string
   *                   example: Server error
   */
  router.put("/appointment", verifyToken, staffController.handleBookingsAppoinment);

  /**
 * @swagger
 * /api/request-ready:
 *   get:
 *     summary: Get requests ready for valuation
 *     description: Retrieve a list of requests that are ready for valuation
 *     tags:
 *       - Request
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved list of requests ready for valuation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   requestId:
 *                     type: integer
 *                     example: 1
 *                   requestImage:
 *                     type: string
 *                     example: 'https://example.com/image.jpg'
 *                   note:
 *                     type: string
 *                     example: 'Customer note here'
 *                   createdDate:
 *                     type: string
 *                     format: date-time
 *                     example: '2024-06-22T14:00:00Z'
 *                   paymentStatus:
 *                     type: string
 *                     example: 'Paid'
 *                   serviceName:
 *                     type: string
 *                     example: 'Diamond Valuation'
 *                   status:
 *                     type: string
 *                     example: 'Ready for valuation'
 *                   processStatus:
 *                     type: string
 *                     example: 'In Process'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errCode:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: 'Unauthorized'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errCode:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: 'Server error'
 */
  router.get("/request-ready", verifyToken, staffController.handleGetRequestReadyForValuation);

  /**
 * @swagger
 * /api/take-request-for-valuation:
 *   put:
 *     summary: Take request for valuation
 *     description: Assign a staff member to a request for valuation
 *     tags:
 *       - Request
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               staffId:
 *                 type: integer
 *                 example: 123
 *               requestId:
 *                 type: integer
 *                 example: 456
 *     responses:
 *       200:
 *         description: Successfully taken request for valuation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid input parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errCode:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: 'Invalid input parameters'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errCode:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: 'Unauthorized'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errCode:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: 'Server error'
 */
  router.put("/take-request-for-valuation", verifyToken, staffController.handleTakeRequestForValuation);

  /**
 * @swagger
 * /api/take-request-by-valuation:
 *   get:
 *     summary: Get requests taken by valuation
 *     description: Retrieve a list of requests that have been taken by a staff member for valuation
 *     tags:
 *       - Request
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: staffId
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *     responses:
 *       200:
 *         description: Successfully retrieved requests taken by valuation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   requestId:
 *                     type: integer
 *                     example: 456
 *                   requestImage:
 *                     type: string
 *                     example: 'image.jpg'
 *                   note:
 *                     type: string
 *                     example: 'Customer notes'
 *                   createdDate:
 *                     type: string
 *                     format: date-time
 *                     example: '2024-06-21T00:00:00.000Z'
 *                   paymentStatus:
 *                     type: string
 *                     example: 'Paid'
 *                   serviceName:
 *                     type: string
 *                     example: 'Diamond Valuation'
 *                   status:
 *                     type: string
 *                     example: 'TakeByValuation'
 *                   processStatus:
 *                     type: string
 *                     example: 'Valuated'
 *       400:
 *         description: Invalid input parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errCode:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: 'Invalid input parameters'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errCode:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: 'Unauthorized'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errCode:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: 'Server error'
 */
  router.get("/take-request-by-valuation", verifyToken, staffController.handleGetRequestTakenByValuation);

  /**
  * @swagger
  * /api/finished-request:
  *   get:
  *     summary: Get finished requests ready for return
  *     description: Retrieve a list of finished requests that are ready to be returned to the customer
  *     tags:
  *       - Request
  *     security:
  *       - bearerAuth: []
  *     responses:
  *       200:
  *         description: Successfully retrieved finished requests ready for return
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 type: object
  *                 properties:
  *                   requestId:
  *                     type: integer
  *                     example: 456
  *                   requestImage:
  *                     type: string
  *                     example: 'image.jpg'
  *                   note:
  *                     type: string
  *                     example: 'Customer notes'
  *                   createdDate:
  *                     type: string
  *                     format: date-time
  *                     example: '2024-06-21T00:00:00.000Z'
  *                   paymentStatus:
  *                     type: string
  *                     example: 'Paid'
  *                   serviceName:
  *                     type: string
  *                     example: 'Diamond Valuation'
  *                   status:
  *                     type: string
  *                     example: 'TakeByValuation'
  *                   processStatus:
  *                     type: string
  *                     example: 'Valuated'
  *       401:
  *         description: Unauthorized
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 errCode:
  *                   type: integer
  *                   example: 1
  *                 message:
  *                   type: string
  *                   example: 'Unauthorized'
  *       500:
  *         description: Server error
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 errCode:
  *                   type: integer
  *                   example: 1
  *                 message:
  *                   type: string
  *                   example: 'Server error'
  */
  router.get("/finished-request", verifyToken, staffController.handleGetFinishedRequest);

  /**
 * @swagger
 * /api/finish-request-by-user:
 *   get:
 *     summary: Get finished requests by user
 *     description: Retrieve a list of finished requests for a specific user
 *     tags:
 *       - Request
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved finished requests by user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errCode:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: 'Success'
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       requestId:
 *                         type: integer
 *                         example: 123
 *                       requestImage:
 *                         type: string
 *                         example: 'image.jpg'
 *                       note:
 *                         type: string
 *                         example: 'Customer notes'
 *                       createdDate:
 *                         type: string
 *                         format: date-time
 *                         example: '2024-06-21T00:00:00.000Z'
 *                       paymentStatus:
 *                         type: string
 *                         example: 'Paid'
 *                       serviceName:
 *                         type: string
 *                         example: 'Diamond Valuation'
 *       400:
 *         description: Missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errCode:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: 'Invalid input parameters'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errCode:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: 'Unauthorized'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errCode:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: 'Server error'
 */
  router.get("/finish-request-by-user", verifyToken, userController.handleGetFinishRequestByUser)

  /**
 * @swagger
 * /api/notification-valuation-success:
 *   post:
 *     summary: Notify user of successful diamond valuation
 *     description: Send an email notification to the user when their diamond valuation request has been completed successfully
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestId:
 *                 type: integer
 *                 example: 123
 *     responses:
 *       200:
 *         description: Successfully sent notification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errCode:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: 'Email sent successfully'
 *       400:
 *         description: Invalid input parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errCode:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: 'Invalid input parameters'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errCode:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: 'Unauthorized'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errCode:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: 'Server error'
 */
  router.post("/notification-valuation-success", verifyToken, userController.handleNotificationValuationSuccess);

  router.post("/customer-took-sample", verifyToken, staffController.handleCustomerTookSample);

  router.get("/request-approved", verifyToken, managerController.handleGetRequestApproved);

  router.post("/active-account", userController.handleActiveAccount);

  router.get("/bill", verifyToken, managerController.handleGetBill);

  router.get("/icon", (req, res) => {
    res.send('😀😃😄😁😆😅🤣😂');
  });
  return app.use("/api", router);
};

module.exports = initWebRoutes;
