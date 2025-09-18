import express from "express";
import { authorize_permissions, middleware_authenticate_token } from "../middleware/auth.js";
import { UserPermissions } from "../constants.js"

import { deleteUser, editUser, getUsers, loginUser, registerUser } from "../controllers/UserController.js";

const router = express.Router();

/**
 * Create the authentication endpoints.
 * @param {*} router - Express router instance
 */

// ? Receive { name, email, password } and create a new user in the database.
router.post("/register", registerUser);

// ? Receive { name, password }, validate credentials, and return a JWT access token.
router.post("/login", loginUser);

// ? Receive { name }, delete a user from the database if authorized.
router.post("/delete", middleware_authenticate_token, authorize_permissions([UserPermissions.DELETE_USER]), deleteUser);

// ? Receive {  previousName, newName, newEmail, newPassword }, update the specified field of a user if authorized.
router.post("/edit", middleware_authenticate_token, authorize_permissions([UserPermissions.EDIT_USER]), editUser);

// ? Retrieve an array of all users in the database.
router.get("/users", getUsers);

export default router;