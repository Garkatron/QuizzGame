import express from "express";
import { authorize_permissions, middleware_authenticate_token } from "../middleware/auth.js";
import { UserPermissions } from "../constants.js"
import { createCollection, deleteCollection, editCollection, getCollections, getCollectionsByID, getCollectionsByOwner } from "../controllers/CollectionController.js";

const router = express.Router();

/**
 * @swagger
 * /api/collection/create:
 *   post:
 *     summary: Create a new quiz collection
 *     description: Create a new quiz collection with a name, tags, and an array of question IDs. Requires JWT and CREATE_COLLECTION permission.
 *     tags:
 *       - Collections
 *     security:
 *       - bearerAuth: []   # JWT requerido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - questions
 *             properties:
 *               name:
 *                 type: string
 *                 example: Geography Quiz
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["geography","capitals"]
 *               questions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["64f5a9b7c3d9e12f7e9b4567","64f5a9b7c3d9e12f7e9b4568"]
 *     responses:
 *       200:
 *         description: Collection created successfully
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
 *                       example: Collection created successfully
 *                     collection:
 *                       type: object
 *                       example:
 *                         _id: 64f6b8d8c3d9e12f7e9c1234
 *                         name: Geography Quiz
 *                         tags: ["geography","capitals"]
 *                         questions: ["64f5a9b7c3d9e12f7e9b4567","64f5a9b7c3d9e12f7e9b4568"]
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
router.post("/api/collection/create", middleware_authenticate_token, authorize_permissions([UserPermissions.CREATE_COLLECTION]), createCollection);

/**
 * @swagger
 * /api/collection/edit:
 *   post:
 *     summary: Edit a quiz collection
 *     description: Update a quiz collection's name, tags, or questions. Only the owner or a user with EDIT_COLLECTION permission can perform this action.
 *     tags:
 *       - Collections
 *     security:
 *       - bearerAuth: []   # JWT requerido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - collection_id
 *             properties:
 *               collection_id:
 *                 type: string
 *                 example: 64f6b8d8c3d9e12f7e9c1234
 *               owner_id:
 *                 type: string
 *                 example: 64f4f9c6a2b1a3f9d7e9b123
 *               name:
 *                 type: string
 *                 example: Geography Quiz Updated
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["geography","capitals","europe"]
 *               questions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["64f5a9b7c3d9e12f7e9b4567","64f5a9b7c3d9e12f7e9b4568"]
 *     responses:
 *       200:
 *         description: Collection updated successfully
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
 *                       example: Collection edited successfully
 *                     collection:
 *                       type: object
 *                       example:
 *                         _id: 64f6b8d8c3d9e12f7e9c1234
 *                         name: Geography Quiz Updated
 *                         tags: ["geography","capitals","europe"]
 *                         questions: ["64f5a9b7c3d9e12f7e9b4567","64f5a9b7c3d9e12f7e9b4568"]
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
router.post("/api/collection/edit", middleware_authenticate_token, authorize_permissions([UserPermissions.EDIT_COLLECTION]), editCollection);

/**
 * @swagger
 * /api/collection/delete:
 *   post:
 *     summary: Delete a quiz collection
 *     description: Delete a quiz collection from the database. Only the owner or a user with DELETE_COLLECTION permission can perform this action.
 *     tags:
 *       - Collections
 *     security:
 *       - bearerAuth: []   # JWT requerido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - owner_id
 *               - collection_id
 *             properties:
 *               owner_id:
 *                 type: string
 *                 example: 64f4f9c6a2b1a3f9d7e9b123
 *               collection_id:
 *                 type: string
 *                 example: 64f6b8d8c3d9e12f7e9c1234
 *     responses:
 *       200:
 *         description: Collection deleted successfully
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
 *                       example: Collection deleted successfully
 *                     collection:
 *                       type: object
 *                       example:
 *                         _id: 64f6b8d8c3d9e12f7e9c1234
 *                         name: Geography Quiz
 *                         tags: ["geography","capitals"]
 *                         questions: ["64f5a9b7c3d9e12f7e9b4567","64f5a9b7c3d9e12f7e9b4568"]
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
router.post("/api/collection/delete", middleware_authenticate_token, authorize_permissions([UserPermissions.DELETE_COLLECTION]), deleteCollection);

router.get("/api/collections/id/:id", getCollectionsByID);

// ? Receive { ownername }, get all collections of a specific user, including questions.
router.get("/api/collections/owner/:ownername", getCollectionsByOwner);

/**
 * @swagger
 * /api/collections:
 *   get:
 *     summary: Get all quiz collections
 *     description: Retrieve all quiz collections in the database, including their questions.
 *     tags:
 *       - Collections
 *     security:
 *       - bearerAuth: []   # JWT opcional según tu política de seguridad
 *     responses:
 *       200:
 *         description: List of all quiz collections
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
 *                         example: 64f6b8d8c3d9e12f7e9c1234
 *                       name:
 *                         type: string
 *                         example: Geography Quiz
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["geography","capitals"]
 *                       questions:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example: 64f5a9b7c3d9e12f7e9b4567
 *                             question_text:
 *                               type: string
 *                               example: What is the capital of France?
 *                             options:
 *                               type: array
 *                               items:
 *                                 type: string
 *                               example: ["Paris","London","Berlin","Rome"]
 *                             answer:
 *                               type: string
 *                               example: Paris
 *                             tags:
 *                               type: array
 *                               items:
 *                                 type: string
 *                               example: ["geography","capital"]
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
router.get("/api/collections", getCollections);

export default router;