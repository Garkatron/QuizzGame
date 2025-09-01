import { Question, QuizzCollection, User } from "../db/models.js"
import { compare_password, hash_password, send_response_not_found, send_response_successful, send_response_unsuccessful, has_valid_password, has_valid_email, has_valid_name, email_not_used, user_exists, does_user_exist, is_valid_string, generate_access_token, has_ownership_or_admin } from "../utils/utils.js"
import { COLLECTION_ALREADY_EXISTS, COLLECTION_NOT_FOUND, INVALID_OPTIONS_ARRAY, INVALID_PASSWORD, INVALID_QUESTIONS_ARRAY, INVALID_STRING, INVALID_TAGS_ARRAY, MIN_OPTIONS, MISSING_PARAMETERS, NEED_ANSWER, NOT_FOUND_USER, OPTIONS_MUST_INCLUDE_ANSWER, QUESTION_ALREADY_EXISTS, QUESTION_NOT_FOUND, USER_EXISTS, UserPermissions } from "../constants.js"
import { authorize_permissions, middleware_authenticate_token } from "./middleware.js";

// * ------------------------------------------------------------------------------------------
// ? API DOCUMENTATION
// ? USEFUL INFO:
// * Every endpoint should throw an error if any of the parameters are invalid, fail the checks, or something goes wrong.
// * The error message is sent as an unsuccessful response by a helper function.
// * Every endpoint checks the session token and whether the requesting user has the correct permissions.
// ? SECURITY:
// * See ./middleware.js
// * ------------------------------------------------------------------------------------------


/**
 * Create the authentication endpoints.
 * @param {*} app - Express app instance
 */
function MakeOuthPoints(app) {
    // ? Receive { name, email, password } and create a new user in the database.
    app.post("/api/auth/register", async (req, res) => {
        try {
            const { name, email, password } = req.body;

            has_valid_name(name);

            const user = await User.findOne({ name });
            if (user) throw new Error(USER_EXISTS);

            has_valid_email(email);
            await email_not_used(email);

            has_valid_password(password);

            const newUser = new User({
                name,
                email,
                password: await hash_password(password),
                permissions: {
                    [UserPermissions.ADMIN]: false,
                    [UserPermissions.EDIT_QUESTION]: true,
                    [UserPermissions.DELETE_QUESTION]: true,
                    [UserPermissions.CREATE_QUESTION]: true,
                    [UserPermissions.CREATE_COLLECTION]: true,
                    [UserPermissions.EDIT_COLLECTION]: true,
                    [UserPermissions.DELETE_COLLECTION]: true,
                    [UserPermissions.EDIT_USER]: true,
                    [UserPermissions.DELETE_USER]: true,
                    [UserPermissions.CREATE_USER]: true,
                },
                score: 0
            });

            await newUser.save();

            return send_response_successful(res, "User created succefully", { _id: newUser._id, name: newUser.name, email: newUser.email })

        } catch (error) {
            return send_response_unsuccessful(res, [error.message]);
        }
    });

    // ? Receive { name, password }, validate credentials, and return a JWT access token.
    app.post("/api/auth/login", async (req, res) => {
        try {
            const { name, password } = req.body;

            const user = await user_exists({ name });

            const isMatch = await compare_password(password, user.password);
            if (!isMatch) {
                return send_response_unsuccessful(res, [INVALID_PASSWORD]);
            }

            const accessToken = generate_access_token(name, user.permissions);

            return send_response_successful(res, "Login successful", {
                user: { _id: user._id, name: user.name, email: user.email, permissions: user.permissions },
                accessToken
            });

        } catch (error) {
            return send_response_unsuccessful(res, [error.message]);
        }
    });

    // ? Receive { name }, delete a user from the database if authorized.
    app.post("/api/auth/delete", middleware_authenticate_token, authorize_permissions([UserPermissions.DELETE_USER]), async (req, res) => {
        try {
            const { name } = req.body;

            has_valid_name(name);

            const user = await user_exists({ name: req.user.name });
            const userToDelete = await user_exists({ name });

            has_ownership_or_admin(user, userToDelete._id);

            const deleted = await userToDelete.deleteOne();

            return send_response_successful(res, deleted);

        } catch (error) {
            return send_response_unsuccessful(res, [error.message]);
        }
    });

    // ? Receive {  previousName, newName, newEmail, newPassword }, update the specified field of a user if authorized.
    app.post("/api/auth/edit", middleware_authenticate_token, authorize_permissions([UserPermissions.EDIT_USER]), async (req, res) => {
        try {
            const { previousName, newName, newEmail, newPassword } = req.body;

            const userToUpdate = await user_exists({ name: previousName });
            const editor = await user_exists({ name: req.user.name });

            has_ownership_or_admin(editor, userToUpdate._id);

            const updates = {};

            if (newName?.trim() && is_valid_string(newName)) {
                updates.name = newName.trim();
            }

            if (newEmail?.trim()) {
                has_valid_email(newEmail);
                updates.email = newEmail.trim();
            }

            if (newPassword?.trim()) {
                has_valid_password(newPassword);
                const hashed = await hash_password(newPassword);
                updates.password = hashed;
            }

            if (Object.keys(updates).length > 0) {
                await userToUpdate.updateOne(updates);
            }

            return send_response_successful(res, "User edited successfully", userToUpdate);

        } catch (error) {
            return send_response_unsuccessful(res, [error.message]);
        }
    });

    // ? Retrieve an array of all users in the database.
    app.get("/api/users", async (req, res) => {
        try {

            const users = await User.find().select("name username permissions");

            return send_response_successful(res, "Login successful", users);

        } catch (error) {
            return send_response_unsuccessful(res, [error.message]);
        }
    });
}

/**
 * Create the rest of the endpoints (questions and collections).
 * @param {*} app 
 */
export default function MakeEndpoints(app) {

    // ? Root endpoint, returns a welcome message.
    app.post('/', (req, res) => {
        res.send('<h1>Hello from Deus Quizzes server!</h1>');
    });

    MakeOuthPoints(app);

    // ? Receive { id }, delete a question from the database if authorized.
    app.post("/api/question/delete", middleware_authenticate_token, authorize_permissions([UserPermissions.DELETE_QUESTION]), async (req, res) => {
        try {
            const { id } = req.body;

            const question = await Question.findOne({ _id: id });

            const user = await user_exists({ name: req.user.name });
            has_ownership_or_admin(user, question._id);

            if (question) {
                const deleted = await question.deleteOne();
                return send_response_successful(res, "Question deleted successfully", deleted);
            } else {
                return send_response_unsuccessful(res, [QUESTION_NOT_FOUND]);
            }
        } catch (error) {
            return send_response_unsuccessful(res, [error.message]);
        }
    });

    // ? Receive { id, field, value }, update the specified field of a question if authorized.
    // TODO: Change to receive a complete question body
    app.post("/api/question/edit", middleware_authenticate_token, authorize_permissions([UserPermissions.EDIT_QUESTION]), async (req, res) => {
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
                return send_response_unsuccessful(res, [QUESTION_NOT_FOUND]);
            }
        } catch (error) {
            return send_response_unsuccessful(res, [error.message]);
        }
    });

    // ? Receive { user_name, question_text, options, answer, tags }, create a new question.
    app.post("/api/question/create", middleware_authenticate_token, authorize_permissions([UserPermissions.CREATE_QUESTION]), async (req, res) => {
        try {
            const { user_name, question_text, options, answer, tags } = req.body;

            if (!is_valid_string(question_text)) {
                return send_response_unsuccessful(res, [INVALID_STRING]);
            }

            if (!is_valid_string(answer)) {
                return send_response_unsuccessful(res, [NEED_ANSWER]);
            }

            if (!Array.isArray(options) || options.length < MIN_OPTIONS) {
                return send_response_unsuccessful(res, [INVALID_OPTIONS_ARRAY]);
            }
            if (!Array.isArray(tags)) {
                return send_response_unsuccessful(res, [INVALID_TAGS_ARRAY]);
            }
            if (!options.includes(answer)) {
                return send_response_unsuccessful(res, [OPTIONS_MUST_INCLUDE_ANSWER]);
            }

            const user = await user_exists({ name: user_name });

            const existing = await Question.findOne({ question: question_text, owner: user._id });

            if (existing) {
                return send_response_unsuccessful(res, [QUESTION_ALREADY_EXISTS]);
            }

            const newQuestion = new Question({ question: question_text, options, answer, tags, owner: user._id });
            await newQuestion.save();

            return send_response_successful(res, "Question created successfully", newQuestion);

        } catch (error) {
            return send_response_unsuccessful(res, [error.message]);
        }
    });

    // ? Receive { name, tags, questions }, create a new quiz collection.
    app.post("/api/collection/create", middleware_authenticate_token, authorize_permissions([UserPermissions.CREATE_COLLECTION]), async (req, res) => {
        try {
            const { user_name, name, tags, questions } = req.body;

            if (!is_valid_string(name)) {
                return send_response_unsuccessful(res, [INVALID_STRING]);
            }
            if (!Array.isArray(tags)) {
                return send_response_unsuccessful(res, [INVALID_TAGS_ARRAY]);
            }
            if (!Array.isArray(questions)) {
                return send_response_unsuccessful(res, [INVALID_QUESTIONS_ARRAY]);
            }

            const user = await user_exists({ name: req.user.name });
            const existing = await QuizzCollection.findOne({ name, owner: user._id });

            if (existing) {
                return send_response_unsuccessful(res, [COLLECTION_ALREADY_EXISTS]);
            }

            const newCollection = new QuizzCollection({ name, tags, questions, owner: user._id });
            newCollection.save();

            return send_response_successful(res, "Collection created", newCollection);
        } catch (error) {
            return send_response_unsuccessful(res, [error.message]);
        }
    });

    // ? Receive { collection_id, owner_id, name, tags, questions }, update a collection if authorized.
    app.post("/api/collection/edit", middleware_authenticate_token, authorize_permissions([UserPermissions.EDIT_COLLECTION]), async (req, res) => {
        try {
            const { collection_id, name, tags, questions } = req.body;

            const user = await user_exists({ name: req.user.name });

            if (!collection_id) {
                return send_response_unsuccessful(res, [MISSING_PARAMETERS]);
            }

            const collection = await QuizzCollection.findOne({ _id: collection_id, owner: user._id });
            if (!collection) {
                return send_response_unsuccessful(res, [COLLECTION_NOT_FOUND]);
            }

            has_ownership_or_admin(user, collection.owner);

            if (name !== undefined) collection.name = name;

            const existing = await QuizzCollection.findOne({ name: name, owner: user._id });

            if (existing) {
                return send_response_unsuccessful(res, [COLLECTION_ALREADY_EXISTS]);
            }

            if (tags !== undefined) collection.tags = tags;
            if (questions !== undefined) collection.questions = questions;

            await collection.save();

            return send_response_successful(res, "Collection edited successfully", collection);

        } catch (error) {
            return send_response_unsuccessful(res, [error.message]);
        }
    });

    // ? Receive { owner_id, collection_id }, delete a collection if authorized.
    app.post("/api/collection/delete", middleware_authenticate_token, authorize_permissions([UserPermissions.DELETE_COLLECTION]), async (req, res) => {
        try {
            const { owner_id, collection_id } = req.body;

            const user = await user_exists({ name: req.user.name });

            const collection = await QuizzCollection.findOne({ _id: collection_id, owner: owner_id });

            if (!collection) {
                return send_response_unsuccessful(res, [COLLECTION_NOT_FOUND]);
            }


            has_ownership_or_admin(user, collection.owner);

            await collection.deleteOne();

            return send_response_successful(res, "Collection deleted successfully", collection);

        } catch (error) {
            return send_response_unsuccessful(res, [error.message]);
        }
    });

    // ? Receive { id }, get a collection by its ID, including its questions.
    app.get("/api/collections/id/:id", async (req, res) => {
        try {
            const { id } = req.params;

            const quizzCollections = await QuizzCollection.findOne({ _id: id })
                .populate("questions");
            return send_response_successful(res, "Quizz Collections", quizzCollections);
        } catch (error) {
            return send_response_unsuccessful(res, [error.message]);
        }
    });

    // ? Receive { ownername }, get all collections of a specific user, including questions.
    app.get("/api/collections/owner/:ownername", async (req, res) => {
        try {

            const { ownername } = req.params;

            const user = await user_exists({ name: ownername });

            const quizzCollections = await QuizzCollection.find({ owner: user._id }).populate("questions");
            return send_response_successful(res, "Quizz Collections", quizzCollections);
        } catch (error) {
            return send_response_unsuccessful(res, [error.message]);

        }
    });

    // ? Get all quiz collections in the database.
    app.get("/api/collections", async (req, res) => {
        try {
            const quizzCollections = await QuizzCollection.find();
            return send_response_successful(res, "Quizz Collections", quizzCollections);
        } catch (error) {
            return send_response_unsuccessful(res, [error.message]);
        }
    });

    // ? Receive { ownername }, get all questions created by a specific user.
    app.get("/api/questions/owner/:ownername", async (req, res) => {
        try {
            const { ownername } = req.params;

            const user = await user_exists({ name: ownername });

            const questions = await Question.find({ owner: user._id });
            return send_response_successful(res, "Questions", questions);
        } catch (error) {
            return send_response_unsuccessful(res, [error.message]);
        }
    });

    // ? Receive { id }, get a question by its ID.
    app.get("/api/questions/id/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const question = await Question.findById(id);
            return send_response_successful(res, "Question", question);
        } catch (error) {
            return send_response_unsuccessful(res, [error.message]);
        }
    });

    // ? Get all questions in the database.
    app.get("/api/questions", async (req, res) => {
        try {
            const questions = await Question.find();
            return send_response_successful(res, "Questions", questions);
        } catch (error) {
            return send_response_unsuccessful(res, [error.message]);
        }
    });

}
