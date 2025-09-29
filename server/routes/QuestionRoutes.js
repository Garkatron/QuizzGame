import express from "express";
import { createQuestion, deleteQuestion, editQuestion, getQuestionByID, getQuestions, getQuestionsByOwner } from "../controllers/QuestionController.js";
import { authorize_permissions, middleware_authenticate_token } from "../middleware/auth.js";
import { UserPermissions } from "../constants.js";
import { handle_validation_errors } from './../middleware/sanitization.js';
import { body } from "express-validator";

const router = express.Router();

/**
 * @swagger
 * /api/v1/questions/delete:
 *   post:
 *     summary: Delete a question
 *     description: Delete a question from the database. Only the owner or an admin with DELETE_QUESTION permission can perform this action.
 *     tags:
 *       - Questions
 *     security:
 *       - bearerAuth: []   # JWT requerido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 example: 64f5a9b7c3d9e12f7e9b4567
 *     responses:
 *       200:
 *         description: Question deleted successfully
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
 *                       example: Question deleted successfully
 *                     question:
 *                       type: object
 *                       example:
 *                         _id: 64f5a9b7c3d9e12f7e9b4567
 *       400:
 *         description: Bad request / validation error
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
router.delete("/delete", middleware_authenticate_token, authorize_permissions([UserPermissions.DELETE_QUESTION]),
    body("id").trim().escape(),
    handle_validation_errors, deleteQuestion);

/**
 * @swagger
 * /api/v1/questions/edit:
 *   post:
 *     summary: Edit a question
 *     description: Update a question in the database. Only the owner or an admin with EDIT_QUESTION permission can perform this action. 
 *     tags:
 *       - Questions
 *     security:
 *       - bearerAuth: []   # JWT requerido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - field
 *               - value
 *             properties:
 *               id:
 *                 type: string
 *                 example: 64f5a9b7c3d9e12f7e9b4567
 *               field:
 *                 type: string
 *                 example: title
 *               value:
 *                 type: string
 *                 example: Updated question title
 *     responses:
 *       200:
 *         description: Question updated successfully
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
 *                       example: Question edited successfully
 *                     question:
 *                       type: object
 *                       example:
 *                         _id: 64f5a9b7c3d9e12f7e9b4567
 *                         title: Updated question title
 *                         options: ["A","B","C","D"]
 *                         answer: "A"
 *       400:
 *         description: Bad request / validation error
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
router.patch("/edit", middleware_authenticate_token, authorize_permissions([UserPermissions.EDIT_QUESTION]),

    body("id").trim().escape(),
    body("field").trim().escape(),
    body("value").trim().escape(),
    handle_validation_errors, editQuestion);

/**
 * @swagger
 * /api/v1/questions/create:
 *   post:
 *     summary: Create a new question
 *     description: Create a new question in the database. Requires JWT and CREATE_QUESTION permission.
 *     tags:
 *       - Questions
 *     security:
 *       - bearerAuth: []   # JWT requerido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_name
 *               - question_text
 *               - options
 *               - answer
 *             properties:
 *               user_name:
 *                 type: string
 *                 example: Alice
 *               question_text:
 *                 type: string
 *                 example: What is the capital of France?
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Paris", "London", "Berlin", "Rome"]
 *               answer:
 *                 type: string
 *                 example: Paris
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["geography", "capital"]
 *     responses:
 *       201:
 *         description: Question created successfully
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
 *                       example: Question created successfully
 *                     question:
 *                       type: object
 *                       example:
 *                         _id: 64f5a9b7c3d9e12f7e9b4567
 *                         user_name: Alice
 *                         question_text: What is the capital of France?
 *                         options: ["Paris", "London", "Berlin", "Rome"]
 *                         answer: Paris
 *                         tags: ["geography","capital"]
 *       400:
 *         description: Bad request / validation error
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
router.post("/create", middleware_authenticate_token, authorize_permissions([UserPermissions.CREATE_QUESTION]),

    body("user_name").trim().escape(),
    body("question_text").trim().escape(),
    body("options").isArray(),
    body("answer").isArray(),
    body("tags").isArray(), handle_validation_errors, createQuestion);

// ? Receive { ownername }, get all questions created by a specific user.
router.get("/owner/:ownername", getQuestionsByOwner);

// ? Receive { id }, get a question by its ID.
router.get("/id/:id", getQuestionByID);

/**
 * @swagger
 * /api/v1/questions:
 *   get:
 *     summary: Get all questions
 *     description: Retrieve all questions from the database.
 *     tags:
 *       - Questions
 *     security:
 *       - bearerAuth: []   # JWT opcional, según tu política de seguridad
 *     responses:
 *       200:
 *         description: List of all questions
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
 *                         example: 64f5a9b7c3d9e12f7e9b4567
 *                       ownername:
 *                         type: string
 *                         example: Alice
 *                       question_text:
 *                         type: string
 *                         example: What is the capital of France?
 *                       options:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["Paris","London","Berlin","Rome"]
 *                       answer:
 *                         type: string
 *                         example: Paris
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["geography","capital"]
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
router.get("/", getQuestions);

export default router;