import express from "express";
import { authorize_permissions, middleware_authenticate_token } from "../middleware/auth.js";
import { UserPermissions } from "../constants.js"
import { createCollection, deleteCollection, editCollection, getCollections, getCollectionsByID, getCollectionsByOwner } from "../controllers/CollectionController.js";

const router = express.Router();

// ? Receive { name, tags, questions }, create a new quiz collection.
router.post("/api/collection/create", middleware_authenticate_token, authorize_permissions([UserPermissions.CREATE_COLLECTION]), createCollection);

// ? Receive { collection_id, owner_id, name, tags, questions }, update a collection if authorized.
router.post("/api/collection/edit", middleware_authenticate_token, authorize_permissions([UserPermissions.EDIT_COLLECTION]), editCollection);

// ? Receive { owner_id, collection_id }, delete a collection if authorized.
router.post("/api/collection/delete", middleware_authenticate_token, authorize_permissions([UserPermissions.DELETE_COLLECTION]), deleteCollection);

// ? Receive { id }, get a collection by its ID, including its questions.
router.get("/api/collections/id/:id", getCollectionsByID);

// ? Receive { ownername }, get all collections of a specific user, including questions.
router.get("/api/collections/owner/:ownername", getCollectionsByOwner);

// ? Get all quiz collections in the database.
router.get("/api/collections", getCollections);