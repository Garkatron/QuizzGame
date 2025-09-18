import express from "express";
import { createQuestion, deleteQuestion, editQuestion, getQuestionByID, getQuestionsByOwner } from "../controllers/QuestionController";
import { authorize_permissions, middleware_authenticate_token } from "../middleware/auth.js";

const router = express.Router();

// ? Receive { id }, delete a question from the database if authorized.
router.post("/delete", middleware_authenticate_token, authorize_permissions([UserPermissions.DELETE_QUESTION]), deleteQuestion);

// ? Receive { id, field, value }, update the specified field of a question if authorized.
// TODO: Change to receive a complete question body
router.post("/edit", middleware_authenticate_token, authorize_permissions([UserPermissions.EDIT_QUESTION]), editQuestion);

// ? Receive { user_name, question_text, options, answer, tags }, create a new question.
router.post("/create", middleware_authenticate_token, authorize_permissions([UserPermissions.CREATE_QUESTION]), createQuestion);

// ? Receive { ownername }, get all questions created by a specific user.
router.get("/owner/:ownername", getQuestionsByOwner);

// ? Receive { id }, get a question by its ID.
router.get("/id/:id", getQuestionByID);

// ? Get all questions in the database.
router.get("/", getQuestionByID);