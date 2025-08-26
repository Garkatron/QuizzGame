import { Question, User } from "../db/models.js"
import { compare_password, send_response_failed_at, hash_password, send_response_not_found, send_response_successful, send_response_unsuccessful, has_valid_password, has_valid_email, has_valid_name, email_not_used, user_exists, user_not_exists, does_user_exist, is_valid_string, generate_access_token } from "../utils/utils.js"
import { INVALID_OPTIONS_ARRAY, INVALID_PASSWORD, INVALID_STRING, MIN_OPTIONS, NOT_FOUND_USER, OPTIONS_MUST_INCLUDE_ANSWER, QUESTION_ALREADY_EXISTS, QUESTION_NOT_FOUND, USER_NOT_EXISTS, UserPermissions } from "../constants.js"
import { authorize_permissions, middleware_authenticate_token } from "./middleware.js";


export default function MakeEndpoints(app) {

    app.post('/', (req, res) => {
        res.send('<h1>Hello, Express.js Server!</h1>');
    });

    app.post("/api/auth/register", async (req, res) => {
        try {
            const { name, email, password } = req.body;

            has_valid_name(name);
            await user_not_exists(name);

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
            return send_response_unsuccessful(res, "Error at register user", [error.message]);
        }
    });

    app.post("/api/auth/login", async (req, res) => {
        try {
            const { name, password } = req.body;

            const user = await User.findOne({ name });
            if (!user) {
                return send_response_not_found(res, "Not found user", [NOT_FOUND_USER]);
            }

            const isMatch = await compare_password(password, user.password);
            if (!isMatch) {
                return send_response_unsuccessful(res, "Bad password", [INVALID_PASSWORD]);
            }

            const accessToken = generate_access_token(name, user.permissions);

            return send_response_successful(res, "Login successful", {
                user: { id: user._id, name: user.name, email: user.email },
                accessToken
            });

        } catch (error) {
            return send_response_unsuccessful(res, "Error searching user", [error.message]);
        }
    });


    app.post("/api/auth/delete", middleware_authenticate_token, authorize_permissions([UserPermissions.DELETE_USER]), async (req, res) => {
        try {
            const { name } = req.body;

            has_valid_name(name);

            if (!does_user_exist(name)) {
                return send_response_not_found(res, "Not found user", [NOT_FOUND_USER])
            }

            // has_valid_password(password);

            const user = await User.findOne({ name });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User don't found",
                    errors: ["Not exists an user with this name"]
                });
            }

            // const isMatch = await compare_password(password, user.password);
            // if (!isMatch) {
            //    return send_response_unsuccessful(res, "Bad password", [INVALID_PASSWORD]);
            // }

            const deleted = await User.deleteOne({ name: user.name })
            return send_response_successful(res, "User deleted successfully", deleted);

        } catch (error) {
            return send_response_unsuccessful(res, "Error at deleting user", [error.message]);
        }
    });


    app.post("/api/auth/edit", middleware_authenticate_token, authorize_permissions([UserPermissions.EDIT_USER]), async (req, res) => {
        try {
            const { name, field, value } = req.body;

            const allowedFields = ["email", "password", "permissions"];
            if (!allowedFields.includes(field)) {
                return send_response_unsuccessful(res, "Invalid field", ["Field not editable"]);
            }

            const user = await User.findOne({ name });
            if (!user) return send_response_unsuccessful(res, "This User doesn't exist", [USER_NOT_EXISTS]);

            // Validaciones
            if (field === "email") has_valid_email(value);
            if (field === "password") {
                const hashed = await hash_password(value);
                await user.updateOne({ password: hashed });
            } else {
                await user.updateOne({ [field]: value });
            }

            const updatedUser = await User.findOne({ name }); // Traer datos actualizados
            return send_response_successful(res, "User edited successfully", updatedUser);

        } catch (error) {
            return send_response_unsuccessful(res, "Error at editing User", [error.message]);
        }
    });

    // QUESTION CRUD

    app.post("/api/question/delete", middleware_authenticate_token, authorize_permissions([UserPermissions.DELETE_QUESTION]), async (req, res) => {
        try {
            const { id } = req.body;

            const question = await Question.findOne({ _id: id });
            if (question) {
                const deleted = await Question.deleteOne({ _id: id });
                return send_response_successful(res, "Question deleted successfully", deleted);
            } else {
                return send_response_unsuccessful(res, "This question doesn't exist", [QUESTION_NOT_FOUND]);
            }
        } catch (error) {
            return send_response_unsuccessful(res, "Error at deleting question", [error.message]);
        }
    });

    app.post("/api/question/edit", middleware_authenticate_token, authorize_permissions([UserPermissions.EDIT_QUESTION]), async (req, res) => {
        try {
            const { id, field, value } = req.body;

            const allowedFields = ["question", "options", "answer"];
            if (!allowedFields.includes(field)) {
                return send_response_unsuccessful(res, "Invalid field", ["Field not editable"]);
            }

            const question = await Question.findOne({ _id: id });
            if (question) {
                await question.updateOne({ [field]: value });
                return send_response_successful(res, "Question edited successfully", question);
            } else {
                return send_response_unsuccessful(res, "This question doesn't exist", [QUESTION_NOT_FOUND]);
            }
        } catch (error) {
            return send_response_unsuccessful(res, "Error at editing question", [error.message]);
        }
    });



    app.post("/api/question/create", middleware_authenticate_token, authorize_permissions([UserPermissions.CREATE_QUESTION]), async (req, res) => {
        try {
            const { question_text, options, answer } = req.body;

            if (!is_valid_string(question_text)) {
                return send_response_unsuccessful(res, "Invalid question text", [INVALID_STRING]);
            }
            if (!Array.isArray(options) || options.length < MIN_OPTIONS) {
                return send_response_unsuccessful(res, "Invalid options", [INVALID_OPTIONS_ARRAY]);
            }
            if (!options.includes(answer)) {
                return send_response_unsuccessful(res, "Invalid answer", [OPTIONS_MUST_INCLUDE_ANSWER]);
            }

            const existing = await Question.findOne({ question: question_text });
            if (existing) {
                return send_response_unsuccessful(res, "This question already exists", [QUESTION_ALREADY_EXISTS]);
            }

            const newQuestion = new Question({ question: question_text, options, answer });
            await newQuestion.save();

            return send_response_successful(res, "Question created successfully", newQuestion);

        } catch (error) {
            return send_response_unsuccessful(res, "Error at creating question", [error.message]);
        }
    });


    // Questions

    app.get("/api/questions", async (req, res) => {
        try {
            const questions = await Question.find();
            return send_response_successful(res, "Questions", questions);
        } catch (error) {
            return send_response_unsuccessful(res, "Error retrieving questions", [error.message]);
        }
    });

}
