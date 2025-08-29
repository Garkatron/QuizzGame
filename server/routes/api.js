import { Question, QuizzCollection, User } from "../db/models.js"
import { compare_password, hash_password, send_response_not_found, send_response_successful, send_response_unsuccessful, has_valid_password, has_valid_email, has_valid_name, email_not_used, user_exists, does_user_exist, is_valid_string, generate_access_token } from "../utils/utils.js"
import { COLLECTION_NOT_FOUND, INVALID_OPTIONS_ARRAY, INVALID_PASSWORD, INVALID_QUESTIONS_ARRAY, INVALID_STRING, INVALID_TAGS_ARRAY, MIN_OPTIONS, NEED_OWNERSHIP_OR_ADMIN, NOT_FOUND_USER, OPTIONS_MUST_INCLUDE_ANSWER, QUESTION_ALREADY_EXISTS, QUESTION_NOT_FOUND, USER_EXISTS, UserPermissions } from "../constants.js"
import { authorize_permissions, middleware_authenticate_token } from "./middleware.js";

function require_ownership_or_admin(user, resourceOwnerId) {
    if (user._id.equals(resourceOwnerId)) return true;
    if (user.permissions.ADMIN) return true;
    return false;
}

function MakeOuthPoints(app) {
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
                permissions: Object.fromEntries(Object.keys(UserPermissions).map(p => [p, false])),
                score: 0
            });

            await newUser.save();

            return send_response_successful(res, "User created succefully", { id: newUser._id, name: newUser.name, email: newUser.email })

        } catch (error) {
            return send_response_unsuccessful(res, [error.message]);
        }
    });

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
                user: { id: user._id, name: user.name, email: user.email },
                accessToken
            });

        } catch (error) {
            return send_response_unsuccessful(res, [error.message]);
        }
    });


    app.post("/api/auth/delete", middleware_authenticate_token, authorize_permissions([UserPermissions.DELETE_USER]), async (req, res) => {
        try {
            const { name } = req.body;

            has_valid_name(name);

            if (!does_user_exist(name)) {
                return send_response_not_found(res, [NOT_FOUND_USER])
            }

            // has_valid_password(password);

            const user = await user_exists({ name });

            // const user = await User.findOne({ name });
            /* if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User don't found",
                    errors: ["Not exists an user with this name"]
                });
            }*/

            // const isMatch = await compare_password(password, user.password);
            // if (!isMatch) {
            //    return send_response_unsuccessful(res, "Bad password", [INVALID_PASSWORD]);
            // }

            const deleted = await User.deleteOne({ name: user.name })
            return send_response_successful(res, deleted);

        } catch (error) {
            return send_response_unsuccessful(res, [error.message]);
        }
    });


    app.post("/api/auth/edit", middleware_authenticate_token, authorize_permissions([UserPermissions.EDIT_USER]), async (req, res) => {
        try {
            const { name, field, value } = req.body;

            const allowedFields = ["email", "password", "permissions"];
            if (!allowedFields.includes(field)) {
                return send_response_unsuccessful(res, ["Field not editable"]);
            }

            const user = await user_exists({ name });

            // const user = await User.findOne({ name });
            // if (!user) return send_response_unsuccessful(res, "This User doesn't exist", [USER_NOT_EXISTS]);

            if (field === "email") has_valid_email(value);
            if (field === "password") {
                const hashed = await hash_password(value);
                await user.updateOne({ password: hashed });
            } else {
                await user.updateOne({ [field]: value });
            }

            const updatedUser = await User.findOne({ name });
            return send_response_successful(res, "User edited successfully", updatedUser);

        } catch (error) {
            return send_response_unsuccessful(res, [error.message]);
        }
    });
}

export default function MakeEndpoints(app) {

    app.post('/', (req, res) => {
        res.send('<h1>Hello, Express.js Server!</h1>');
    });

    MakeOuthPoints(app);

    app.post("/api/question/delete", middleware_authenticate_token, authorize_permissions([UserPermissions.DELETE_QUESTION]), async (req, res) => {
        try {
            const { id } = req.body;

            const question = await Question.findOne({ _id: id });
            if (question) {
                const deleted = await Question.deleteOne({ _id: id });
                return send_response_successful(res, "Question deleted successfully", deleted);
            } else {
                return send_response_unsuccessful(res, [QUESTION_NOT_FOUND]);
            }
        } catch (error) {
            return send_response_unsuccessful(res, [error.message]);
        }
    });

    app.post("/api/question/edit", middleware_authenticate_token, authorize_permissions([UserPermissions.EDIT_QUESTION]), async (req, res) => {
        try {
            const { id, field, value } = req.body;

            const allowedFields = ["question", "options", "answer"];
            if (!allowedFields.includes(field)) {
                return send_response_unsuccessful(res, ["Field not editable"]);
            }

            const question = await Question.findOne({ _id: id });
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



    app.post("/api/question/create", middleware_authenticate_token, authorize_permissions([UserPermissions.CREATE_QUESTION]), async (req, res) => {
        try {
            const { user_name, question_text, options, answer, tags } = req.body;

            if (!is_valid_string(question_text) || !is_valid_string(answer)) {
                return send_response_unsuccessful(res, [INVALID_STRING]);
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

            // const user = await User.findOne({ name: user_name });
            // if (!user) return send_response_unsuccessful(res, "User not found", [USER_NOT_EXISTS]);

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

            const existing = await QuizzCollection.findOne({ name });

            if (existing) {
                return send_response_unsuccessful(res, [COLLECTION_ALREADY_EXISTS]);
            }

            const user = await user_exists({ name: user_name });

            // const user = await User.findOne({ name: user_name });
            // if (!user) return send_response_unsuccessful(res, "User not found", [USER_NOT_EXISTS]);

            const newCollection = new QuizzCollection({ name, tags, questions, owner: user._id });
            newCollection.save();

            return send_response_successful(res, "Collection created", newCollection);
        } catch (error) {
            return send_response_unsuccessful(res, [error.message]);
        }
    });

    app.post("/api/collection/edit", middleware_authenticate_token, authorize_permissions([UserPermissions.EDIT_COLLECTION]), async (req, res) => {
        try {
            const { collection_id, owner_id, name, tags, questions } = req.body;

            if (!collection_id || !owner_id) {
                return send_response_unsuccessful(res, ["Missing parameters"]);
            }

            const collection = await QuizzCollection.findOne({ _id: collection_id, owner: owner_id });
            if (!collection) {
                return send_response_unsuccessful(res, [COLLECTION_NOT_FOUND]);
            }

            const user = await user_exists({ id: owner_id });

            //const user = await User.findOne({ _id: owner_id });
            //if (!user) return send_response_unsuccessful(res, "User not found", [USER_NOT_EXISTS]);

            if (!require_ownership_or_admin(user, collection.owner)) {
                return send_response_unsuccessful(res, [NEED_OWNERSHIP_OR_ADMIN]);
            }

            if (name !== undefined) collection.name = name;
            if (tags !== undefined) collection.tags = tags;
            if (questions !== undefined) collection.questions = questions;

            await collection.save();

            return send_response_successful(res, "Collection edited successfully", collection);

        } catch (error) {
            return send_response_unsuccessful(res, [error.message]);
        }
    });




    app.post("/api/collection/delete", middleware_authenticate_token, authorize_permissions([UserPermissions.DELETE_COLLECTION]), async (req, res) => {
        try {
            const { owner_id, collection_id } = req.body;

            const user = await user_exists({ id: owner_id });

            const collection = await QuizzCollection.findOne({ _id: collection_id, owner: owner_id });

            if (!collection) {
                return send_response_unsuccessful(res, [COLLECTION_NOT_FOUND]);
            }

            if (!require_ownership_or_admin(user, collection.owner)) {
                return send_response_unsuccessful(res, [NEED_OWNERSHIP_OR_ADMIN]);
            }


            await collection.deleteOne();

            return send_response_successful(res, "Collection deleted successfully", collection);

        } catch (error) {
            return send_response_unsuccessful(res, [error.message]);
        }
    });


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

    app.get("/api/collections", async (req, res) => {
        try {
            const quizzCollections = await QuizzCollection.find();
            return send_response_successful(res, "Quizz Collections", quizzCollections);
        } catch (error) {
            return send_response_unsuccessful(res, [error.message]);
        }
    });

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

    app.get("/api/questions/id/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const question = await Question.findById(id);
            return send_response_successful(res, "Question", question);
        } catch (error) {
            return send_response_unsuccessful(res, [error.message]);
        }
    });

    app.get("/api/questions", async (req, res) => {
        try {
            const questions = await Question.find();
            return send_response_successful(res, "Questions", questions);
        } catch (error) {
            return send_response_unsuccessful(res, [error.message]);
        }
    });

}
