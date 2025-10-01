import express from "express";
import { authorize_permissions, middleware_authenticate_token } from "../middleware/auth.js";
import { UserPermissions } from "../constants.js"

import { deleteUser, editUser, getUsers, loginUser, registerUser } from "../controllers/UserController.js";
import { body, param, query } from "express-validator";
import { handle_validation_errors } from './../middleware/sanitization.js';

const router = express.Router();

router.post("/register", body("name").trim().escape(), body("email").trim().escape().normalizeEmail(), body("password").trim(), handle_validation_errors, registerUser);

router.post("/login", body("name").trim().escape(), body("password").trim(), handle_validation_errors, loginUser);

router.delete("/:id", authorize_permissions([UserPermissions.DELETE_USER]), middleware_authenticate_token,
    param("id").trim().escape(), handle_validation_errors, deleteUser);

router.patch("/:id",
    middleware_authenticate_token, authorize_permissions([UserPermissions.EDIT_USER]),
    //body("previousName").trim().escape(),
    query("id").trim().escape(),
    body("newName").trim().escape(),
    body("newEmail").trim().normalizeEmail(),
    body("newPassword").trim().escape(),
    handle_validation_errors,
    editUser);

router.get("/", getUsers);

export default router;