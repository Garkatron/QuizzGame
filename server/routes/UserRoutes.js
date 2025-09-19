import express from "express";
import { authorize_permissions, middleware_authenticate_token } from "../middleware/auth.js";
import { UserPermissions } from "../constants.js"

import { deleteUser, editUser, getUsers, loginUser, registerUser } from "../controllers/UserController.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user in the database with a unique name and email, and a secure password.  
 *                  Automatically assigns default permissions and sets the initial score to 0.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Unique username of the new user
 *                 example: Alice
 *               email:
 *                 type: string
 *                 description: Unique email address of the user
 *                 example: alice@mail.com
 *               password:
 *                 type: string
 *                 description: Strong password for the user account
 *                 example: MyStrongPass123!
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64f4f9c6a2b1a3f9d7e9b123
 *                     name:
 *                       type: string
 *                       example: Alice
 *                     email:
 *                       type: string
 *                       example: alice@mail.com
 *       400:
 *         description: Invalid input or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User already exists
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unexpected server error
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: User login
 *     description: |
 *       Authenticates a user with their username and password.  
 *       If the credentials are valid, returns user information along with a JWT access token for authorization.  
 *       The access token should be used in the `Authorization` header for protected routes.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: The username of the user
 *                 example: Alice
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: MyStrongPass123!
 *     responses:
 *       200:
 *         description: Successful login, returns user data and JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       description: Logged-in user's details
 *                       properties:
 *                         _id:
 *                           type: string
 *                           description: User unique identifier
 *                           example: 64f4f9c6a2b1a3f9d7e9b123
 *                         name:
 *                           type: string
 *                           description: Username
 *                           example: Alice
 *                         email:
 *                           type: string
 *                           description: User's email
 *                           example: alice@mail.com
 *                         permissions:
 *                           type: object
 *                           description: User permissions, where keys are permission names and values are boolean
 *                           additionalProperties:
 *                             type: boolean
 *                     accessToken:
 *                       type: string
 *                       description: JWT token for authenticating protected routes
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Invalid credentials or missing parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid username or password
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/v1/users/delete:
 *   delete:
 *     summary: Delete a user
 *     description: |
 *       Deletes a user from the database.  
 *       Only the account owner or an admin with the `DELETE_USER` permission can perform this action.  
 *       Requires a valid JWT in the `Authorization` header.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The username of the account to be deleted
 *                 example: Alice
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: User deleted
 *                     user:
 *                       type: object
 *                       description: Details of the deleted user
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 64f4f9c6a2b1a3f9d7e9b123
 *                         name:
 *                           type: string
 *                           example: Alice
 *                         email:
 *                           type: string
 *                           example: alice@mail.com
 *                         permissions:
 *                           type: object
 *                           description: User permissions before deletion
 *                           additionalProperties:
 *                             type: boolean
 *       400:
 *         description: Bad request or validation error (invalid username or insufficient permissions)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid username or unauthorized
 *       401:
 *         description: Unauthorized (JWT missing or invalid)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 */
router.delete("/delete", middleware_authenticate_token, authorize_permissions([UserPermissions.DELETE_USER]), deleteUser);

/**
 * @swagger
 * /api/v1/users/edit:
 *   patch:
 *     summary: Edit a user
 *     description: |
 *       Updates the name, email, or password of a user.  
 *       Only the account owner or an admin with the `EDIT_USER` permission can perform this action.  
 *       Requires a valid JWT in the `Authorization` header.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - previousName
 *             properties:
 *               previousName:
 *                 type: string
 *                 description: The current username of the account to update
 *                 example: Alice
 *               newName:
 *                 type: string
 *                 description: New username (optional)
 *                 example: AliceNew
 *               newEmail:
 *                 type: string
 *                 description: New email address (optional)
 *                 example: alice.new@mail.com
 *               newPassword:
 *                 type: string
 *                 description: New password (optional)
 *                 example: NewStrongPass123!
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: User edited successfully
 *                     user:
 *                       type: object
 *                       description: Updated user details
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 64f4f9c6a2b1a3f9d7e9b123
 *                         name:
 *                           type: string
 *                           example: AliceNew
 *                         email:
 *                           type: string
 *                           example: alice.new@mail.com
 *                         permissions:
 *                           type: object
 *                           description: User permissions after update
 *                           additionalProperties:
 *                             type: boolean
 *       400:
 *         description: Bad request or validation error (invalid input or missing required fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid input or unauthorized
 *       401:
 *         description: Unauthorized (JWT missing or insufficient permissions)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 */
router.patch("/edit", middleware_authenticate_token, authorize_permissions([UserPermissions.EDIT_USER]), editUser);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get users
 *     description: |
 *       Retrieves a paginated list of users from the database.  
 *       You can filter users by `id`, `name`, or `email` using query parameters.  
 *       Optionally, you can paginate results using `page` and `limit`.  
 *       Requires a valid JWT in the `Authorization` header if the endpoint is protected.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *         example: 64f4f9c6a2b1a3f9d7e9b123
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by username (case-insensitive, partial match)
 *         example: Alice
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter by exact email
 *         example: alice@mail.com
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of users per page
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Users
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 64f4f9c6a2b1a3f9d7e9b123
 *                       name:
 *                         type: string
 *                         example: Alice
 *                       email:
 *                         type: string
 *                         example: alice@mail.com
 *                       permissions:
 *                         type: object
 *                         description: User permissions
 *                         additionalProperties:
 *                           type: boolean
 *       400:
 *         description: Bad request / invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: Invalid parameters
 */
router.get("/", getUsers);

export default router;