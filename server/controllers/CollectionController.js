import QuizzCollection from "../models/QuizzCollection.js";
import Question from "../models/Question.js";
import { send_response_created, send_response_not_found, send_response_successful, send_response_unsuccessful } from "../utils/responses.js"
import { ERROR_MESSAGES } from "../constants.js";
import { has_ownership_or_admin } from "../utils/utils.js";
import { user_exists } from "../controllers/UserController.js";
import { sanitize } from "../utils/sanitize.js";

export const createCollection = async (req, res) => {
    try {
        const { name, tags, questions } = req.body;

        const user = await user_exists({ name: req.user.name });
        const existing = await QuizzCollection.findOne({ name, owner: user._id });

        if (existing) {
            return send_response_unsuccessful(res, [ERROR_MESSAGES.COLLECTION_ALREADY_EXISTS]);
        }

        const newCollection = new QuizzCollection({ name, tags, questions, owner: user._id });
        newCollection.save();

        return send_response_created(res, "Collection created", newCollection);
    } catch (error) {
        return send_response_unsuccessful(res, [error.message]);
    }
}

export const editCollection = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, tags, questions } = req.body;

        const user = await user_exists({ name: req.user.name });

        const collection = await QuizzCollection.findOne({ _id: id, owner: user._id });
        if (!collection) {
            return send_response_not_found(res, [ERROR_MESSAGES.COLLECTION_NOT_FOUND]);
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
        const { id } = req.params;

        const user = await user_exists({ name: req.user.name });

        const collection = await QuizzCollection.findOne({ _id: id });

        if (!collection) {
            return send_response_not_found(res, [ERROR_MESSAGES.COLLECTION_NOT_FOUND]);
        }

        has_ownership_or_admin(user, collection.owner);

        await collection.deleteOne();

        return send_response_successful(res, "Collection deleted successfully", collection);

    } catch (error) {
        return send_response_unsuccessful(res, [error.message]);
    }
}

export const getCollectionsFiltered = async (req, res) => {
    try {
        const { name, id, owner, tags, questions } = req.body;
        const page = parseInt(req.body.page) || 1;
        const limit = parseInt(req.body.limit) || 20;

        const query = {};
        if (id) query._id = id;
        if (name) query.name = name;
        if (owner) query.owner = owner;
        if (tags) query.tags = { $in: tags.map(sanitize) };
        if (questions) query.questions = { $all: questions };

        const quizzCollections = await QuizzCollection.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("questions");
        return send_response_successful(res, "Quizz Collections", quizzCollections);
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
        const { name, id, owner, tags, questions, page, limit } = req.query;
        const pageInt = parseInt(page) || 1;
        const limitInt = parseInt(limit) || 20;

        const query = {};
        if (id) query._id = id;
        if (name) query.name = { $regex: sanitize(name), $options: "i" };
        if (owner) query.owner = owner;
        if (tags) query.tags = { $in: tags.map(sanitize) };
        if (questions) query.questions = { $all: questions };

        const quizzCollections = await QuizzCollection.find(query)
            .skip((pageInt - 1) * limitInt)
            .limit(limitInt)
            .populate("questions");
        return send_response_successful(res, "Quizz Collections", quizzCollections);
    } catch (error) {
        return send_response_unsuccessful(res, [error.message]);
    }
}


        // if (!is_valid_string(name)) {
        //     return send_response_unsuccessful(res, [ERROR_MESSAGES.INVALID_STRING]);
        // }
        // if (!Array.isArray(tags)) {
        //     return send_response_unsuccessful(res, [ERROR_MESSAGES.INVALID_TAGS_ARRAY]);
        // }
        // if (!Array.isArray(questions)) {
        //     return send_response_unsuccessful(res, [ERROR_MESSAGES.INVALID_QUESTIONS_ARRAY]);
        // }

               // if (!collection_id) {
        //     return send_response_unsuccessful(res, [ERROR_MESSAGES.MISSING_PARAMETERS]);
        // }
