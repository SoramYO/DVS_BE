const express = require('express');
const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');
const staffController = require('../controllers/staffController');
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
    * /api/createNewRequest:
    *  post:
    *   summary: Create a new diamond valuation request
    *   description: Create a new diamond valuation request
    *   tags:
    *      - Request
    *   requestBody:
    *     required: true
    *     content:
    *       application/json:
    *         schema:
    *           type: object
    *           properties:
    *             proportions:
    *               type: string
    *             diamondOrigin:
    *               type: string
    *             caratWeight:
    *               type: number
    *             measurements:
    *               type: string
    *             polish:
    *               type: string
    *             flourescence:
    *               type: string
    *             color:
    *               type: string
    *             cut:
    *               type: string
    *             clarity:
    *               type: string
    *             symmetry:
    *               type: string
    *             shape:
    *               type: string
    *             requestImage:
    *               type: string
    *             note:
    *               type: string
    *             userId:
    *               type: integer
    *             processId:
    *               type: integer
    *             serviceId:
    *               type: integer   
    *   responses:
    *     "200":
    *       description: Request created successfully
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
    */
    router.post("/createNewRequest", verifyToken, userController.handleCreateNewRequest);

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
   *             processStatus:
   *               type: string
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
    *  put:
    *   summary: Valuate diamond
    *   description: Valuate diamond
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
    *             price:
    *               type: number
    *   responses:
    *     "200":
    *       description: Diamond valued successfully
    *     "401":
    *       description: Unauthorized
    */
    router.put("/valuation/:id", verifyToken, staffController.handleValuation);

    /**
    * @swagger
    * /api/users:
    *  get:
    *   summary: Get all users
    *   description: Get all users
    *   tags:
    *      - Admin
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
    *      - Admin
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
         * /api/users:
         *  post:
         *   summary: Create a new user
         *   description: Create a new user
         *   tags:
         *     - Admin
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
        *     - Admin
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
        *             status:
        *               type: integer
        *             roleId:
        *               type: integer
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
         *     - Admin
         *   requestBody:
         *     required: true
         *     content:
         *       application/json:
         *         schema:
         *           type: object
         *           properties:
         *             username:
         *               type: string
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
        *               profit:
        *                 type: number
        *     "401":
        *       description: Unauthorized
        */
    router.get("/profit", verifyToken, adminController.handleGetProfit);

    router.get("/icon", (req, res) => {
        res.send('😀😃😄😁😆😅🤣😂');
    });
    return app.use("/api", router);
};

module.exports = initWebRoutes;
