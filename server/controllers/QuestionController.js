import { ERROR_MESSAGES } from "../constants.js";
import { send_response_not_found, send_response_successful, send_response_unsuccessful } from "../utils/responses.js"
import { is_valid_string } from "../utils/format.js"
import { user_exists } from "../controllers/UserController.js"
import Question from "../models/Question.js";

export const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.body;

        const question = await Question.findOne({ _id: id });

        const user = await user_exists({ name: req.user.name });
        has_ownership_or_admin(user, question._id);

        if (question) {
            const deleted = await question.deleteOne();
            return send_response_successful(res, "Question deleted successfully", deleted);
        } else {
            return send_response_not_found(res, [ERROR_MESSAGES.QUESTION_NOT_FOUND]);
        }
    } catch (error) {
        return send_response_unsuccessful(res, [error.message]);
    }
}

export const editQuestion = async (req, res) => {
    try {
        const { id, field, value } = req.body;

        const allowedFields = ["question", "options", "answer"];
        if (!allowedFields.includes(field)) {
            return send_response_unsuccessful(res, ["Field not editable"]);
        }

        const question = await Question.findOne({ _id: id });

        const user = await user_exists({ name: req.user.name });
        has_ownership_or_admin(user, question._id);

        if (question) {
            await question.updateOne({ [field]: value });
            return send_response_successful(res, "Question edited successfully", question);
        } else {
            return send_response_not_found(res, [ERROR_MESSAGES.QUESTION_NOT_FOUND]);
        }
    } catch (error) {
        return send_response_unsuccessful(res, [error.message]);
    }
}

export const createQuestion = async (req, res) => {
    try {
        const { user_name, question_text, options, answer, tags } = req.body;

        if (!is_valid_string(question_text)) {
            return send_response_unsuccessful(res, [ERROR_MESSAGES.INVALID_STRING]);
        }

        if (!is_valid_string(answer)) {
            return send_response_unsuccessful(res, [ERROR_MESSAGES.NEED_ANSWER]);
        }

        if (!Array.isArray(options) || options.length < MIN_OPTIONS) {
            return send_response_unsuccessful(res, [ERROR_MESSAGES.INVALID_OPTIONS_ARRAY]);
        }
        if (!Array.isArray(tags)) {
            return send_response_unsuccessful(res, [ERROR_MESSAGES.INVALID_TAGS_ARRAY]);
        }

        if (!options.includes(answer)) {
            return send_response_unsuccessful(res, [ERROR_MESSAGES.OPTIONS_MUST_INCLUDE_ANSWER]);
        }

        const user = await user_exists({ name: user_name });

        const existing = await Question.findOne({ question: question_text, owner: user._id });

        if (existing) {
            return send_response_successful(res, [ERROR_MESSAGES.QUESTION_ALREADY_EXISTS], existing);
        }

        const newQuestion = new Question({ question: question_text, options, answer, tags, owner: user._id });
        await newQuestion.save();

        return send_response_successful(res, "Question created successfully", newQuestion);

    } catch (error) {
        return send_response_unsuccessful(res, [error.message]);
    }
}

export const getQuestionsByOwner = async (req, res) => {
    try {
        const { ownername } = req.params;

        const user = await user_exists({ name: ownername });

        const questions = await Question.find({ owner: user._id });
        return send_response_successful(res, "Questions", questions);
    } catch (error) {
        return send_response_unsuccessful(res, [error.message]);
    }
}

export const getQuestionByID = async (req, res) => {
    try {
        const { id } = req.params;
        const question = await Question.findById(id);
        return send_response_successful(res, "Question", question);
    } catch (error) {
        return send_response_unsuccessful(res, [error.message]);
    }
}

export const getQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        return send_response_successful(res, "Questions", questions);
    } catch (error) {
        return send_response_unsuccessful(res, [error.message]);
    }
}