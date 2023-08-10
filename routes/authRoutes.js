import express from 'express'
import rateLimit from 'express-rate-limit'
import { loginController, registerController } from '../controllers/authController.js';

// router object 
const router = express.Router()

// limit func
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // store: ... , // Use an external store for more precise rate limiting
});

// routes

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - lastName
 *         - email
 *         - password
 *         - location
 *       properties:
 *         id:
 *           type: string
 *           description: The Auto-generated id of the user collection
 *         name:
 *           type: string
 *           description: User Name
 *         lastName:
 *           type: string
 *           description: User Last Name
 *         email:
 *           type: string
 *           description: User Email Address
 *         password:
 *           type: string
 *           description: User password should be greater than 6 characters
 *         location:
 *           type: string
 *           description: User Location (city or country)
 *       example:
 *         id: JBSADBOWQRI
 *         name: John
 *         lastName: Smith
 *         email: SmithJohn@gmail.com
 *         password: john@123
 *         location: Delhi
 */

/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: Authenticaiton Apis
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '500':
 *         description: Internal server error
 */


// REGISTER || POST
router.post("/register", limiter, registerController);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login Page
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: Login Successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '500':
 *         description: Something went wrong
 */

// LOGIN || POST
router.post("/login", limiter,  loginController);

// export 
export default router