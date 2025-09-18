import QuizzCollection from "../models/QuizzCollection.js"
import { send_response_successful, send_response_unsuccessful } from "../utils/responses.js"
import { ERROR_MESSAGES } from "../constants.js";
import { is_valid_string } from "../utils/format.js";
import { has_ownership_or_admin } from "../utils/utils.js";
import { user_exists } from "../controllers/UserController.js";

export const createCollection = async (req, res) => {
    try {
        const { user_name, name, tags, questions } = req.body;

        if (!is_valid_string(name)) {
            return send_response_unsuccessful(res, [ERROR_MESSAGES.INVALID_STRING]);
        }
        if (!Array.isArray(tags)) {
            return send_response_unsuccessful(res, [ERROR_MESSAGES.INVALID_TAGS_ARRAY]);
        }
        if (!Array.isArray(questions)) {
            return send_response_unsuccessful(res, [ERROR_MESSAGES.INVALID_QUESTIONS_ARRAY]);
        }

        const user = await user_exists({ name: req.user.name });
        const existing = await QuizzCollection.findOne({ name, owner: user._id });

        if (existing) {
            return send_response_unsuccessful(res, [ERROR_MESSAGES.COLLECTION_ALREADY_EXISTS]);
        }

        const newCollection = new QuizzCollection({ name, tags, questions, owner: user._id });
        newCollection.save();

        return send_response_successful(res, "Collection created", newCollection);
    } catch (error) {
        return send_response_unsuccessful(res, [error.message]);
    }
}

export const editCollection = async (req, res) => {
    try {
        const { collection_id, name, tags, questions } = req.body;

        const user = await user_exists({ name: req.user.name });

        if (!collection_id) {
            return send_response_unsuccessful(res, [ERROR_MESSAGES.MISSING_PARAMETERS]);
        }

        const collection = await QuizzCollection.findOne({ _id: collection_id, owner: user._id });
        if (!collection) {
            return send_response_unsuccessful(res, [ERROR_MESSAGES.COLLECTION_NOT_FOUND]);
        }

        has_ownership_or_admin(user, collection.owner);

        if (name !== undefined) collection.name = name;

        const existing = await QuizzCollection.findOne({ name: name, owner: user._id });

        if (existing) {
            return send_response_unsuccessful(res, [ERROR_MESSAGES.COLLECTION_ALREADY_EXISTS]);
        }

        if (tags !== undefined) collection.tags = tags;
        if (questions !== undefined) collection.questions = questions;

        await collection.save();

        return send_response_successful(res, "Collection edited successfully", collection);

    } catch (error) {
        return send_response_unsuccessful(res, [error.message]);
    }
}

export const deleteCollection = async (req, res) => {
    try {
        const { owner_id, collection_id } = req.body;

        const user = await user_exists({ name: req.user.name });

        const collection = await QuizzCollection.findOne({ _id: collection_id, owner: owner_id });

        if (!collection) {
            return send_response_unsuccessful(res, [ERROR_MESSAGES.COLLECTION_NOT_FOUND]);
        }


        has_ownership_or_admin(user, collection.owner);

        await collection.deleteOne();

        return send_response_successful(res, "Collection deleted successfully", collection);

    } catch (error) {
        return send_response_unsuccessful(res, [error.message]);
    }
}

export const getCollectionsByID = async (req, res) => {
    try {
        const { id } = req.params;

        const quizzCollections = await QuizzCollection.findOne({ _id: id })
            .populate("questions");
        return send_response_successful(res, "Quizz Collections", quizzCollections);
    } catch (error) {
        return send_response_unsuccessful(res, [error.message]);
    }
}

export const getCollectionsByOwner = async (req, res) => {
    try {

        const { ownername } = req.params;

        const user = await user_exists({ name: ownername });

        const quizzCollections = await QuizzCollection.find({ owner: user._id }).populate("questions");
        return send_response_successful(res, "Quizz Collections", quizzCollections);
    } catch (error) {
        return send_response_unsuccessful(res, [error.message]);

    }
}

export const getCollections = async (req, res) => {
    try {
        const quizzCollections = await QuizzCollection.find();
        return send_response_successful(res, "Quizz Collections", quizzCollections);
    } catch (error) {
        return send_response_unsuccessful(res, [error.message]);
    }
}