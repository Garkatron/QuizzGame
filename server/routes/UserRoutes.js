import express from "express";
import { authorize_permissions, middleware_authenticate_token } from "../middleware/auth.js";
import { UserPermissions } from "../constants.js"

import { deleteUser, editUser, getUsers, loginUser, registerUser } from "../controllers/UserController.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/user/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user in the database with a unique email and a secure password.
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
 *                 example: Alice
 *               email:
 *                 type: string
 *                 example: alice@mail.com
 *               password:
 *                 type: string
 *                 example: MyStrongPass123!
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
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
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     summary: Login a user
 *     description: Validate user credentials and return a JWT access token.
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
 *                 example: Alice
 *               password:
 *                 type: string
 *                 example: MyStrongPass123!
 *     responses:
 *       200:
 *         description: Successful login, returns user data and JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
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
 *                           additionalProperties:
 *                             type: boolean
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Missing parameters
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/v1/user/delete:
 *   post:
 *     summary: Delete a user
 *     description: Delete a user from the database. Only the account owner or an admin with DELETE_USER permission can perform this action.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []   # Requiere JWT
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
 *                           additionalProperties:
 *                             type: boolean
 *       400:
 *         description: Bad request / validation error
 */
router.post("/delete", middleware_authenticate_token, authorize_permissions([UserPermissions.DELETE_USER]), deleteUser);

/**
 * @swagger
 * /api/v1/user/edit:
 *   post:
 *     summary: Edit a user
 *     description: Update the name, email, or password of a user. Only the account owner or an admin with EDIT_USER permission can perform this action.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []   # JWT requerido
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
 *                 example: Alice
 *               newName:
 *                 type: string
 *                 example: AliceNew
 *               newEmail:
 *                 type: string
 *                 example: alice.new@mail.com
 *               newPassword:
 *                 type: string
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
 *                           additionalProperties:
 *                             type: boolean
 *       400:
 *         description: Bad request / validation error
 */
router.post("/edit", middleware_authenticate_token, authorize_permissions([UserPermissions.EDIT_USER]), editUser);

/**
 * @swagger
 * /api/v1/user:
 *   get:
 *     summary: Get all users
 *     description: Retrieve an array of all users from the database.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []   # JWT requerido (si quieres protegerlo)
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
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
 *                         additionalProperties:
 *                           type: boolean
 *       400:
 *         description: Bad request
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