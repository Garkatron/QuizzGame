import { Question, User } from "./models.js"
import { compare_password, send_response_failed_at, hash_password, send_response_not_found, send_response_successful, send_response_unsuccessful, validate_password, validate_email, validate_name } from "./utils.js"

export default function MakeEndpoints(app) {
    // * END-POINTS

    app.post('/', (req, res) => {
        res.send('<h1>Hello, Express.js Server!</h1>');
    });

    /**
     * Return a json with questions
     */
    app.get("/api/questions", async (req, res) => {
        const questions = await Question.find();
        res.json(questions);
    })


    // ? POST

    const INVALID_NAME = "Your user name is invalid.";
    const INVALID_PASSWORD = "Your password is invalid.";
    const INVALID_EMAIL = "Your email is invalid.";
    const USER_EXISTS = "This user already exists."
    const NOT_FOUND_USER = "Not exists an user with this name";

    /**
     * Register a new user
     */
    app.post("/api/auth/register", async (req, res) => {
        try {
            const { name, email, password } = req.body;

            let errors = [];

            if (!validate_name(name)) errors.push(INVALID_NAME);
            if (!validate_email(email)) errors.push(INVALID_EMAIL);
            if (!validate_password(password)) errors.push(INVALID_PASSWORD);

            const userByName = await User.findOne({ name });
            if (userByName) errors.push(USER_EXISTS);

            const userByEmail = await User.findOne({ email });
            if (userByEmail) errors.push("Email already exists");

            if (errors.length > 0) {
                return send_response_unsuccessful(res, "Error at register user", errors);
            }

            const newUser = new User({
                name,
                email,
                password: await hash_password(password),
                score: 0
            });

            await newUser.save();

            return send_response_successful(res, "User created succefully", { id: newUser._id, name: newUser.name, email: newUser.email })

        } catch (error) {
            return send_response_failed_at(res, "Error at creating user", error);
        }
    });



    /**
     * Check user to login
     */
    app.post("/api/auth/login", async (req, res) => {
        try {
            const { name, password } = req.body;

            let errors = [];

            if (!validate_name(name)) errors.push(INVALID_NAME);
            if (!validate_password(password)) errors.push(INVALID_PASSWORD);

            if (errors.length > 0) {
                return send_response_unsuccessful(res, "Invalid fields", errors);
            }

            const user = await User.findOne({ name });
            if (!user) {
                return send_response_not_found(res, "Not found user", [NOT_FOUND_USER])
            }

            const isMatch = await compare_password(password, user.password);
            if (!isMatch) {
                return send_response_unsuccessful(res, "Bad password", [INVALID_PASSWORD]);
            }

            return send_response_successful(res, "User exists", user);

        } catch (error) {
            return send_response_failed_at(res, "Error searching user", error);
        }
    });


    /**
     * Delete a user
     */
    app.post("/api/auth/delete", async (req, res) => {
        try {
            const { name, password } = req.body;

            let errors = [];

            if (!validate_name(name)) errors.push(INVALID_NAME);
            if (!validate_password(password)) errors.push(INVALID_PASSWORD);

            if (errors.length > 0) {
                return send_response_unsuccessful(res, "Invalid fields", errors);
            }

            const user = await User.findOne({ name });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User don't found",
                    errors: ["Not exists an user with this name"]
                });
            }

            const isMatch = await compare_password(password, user.password);
            if (!isMatch) {
                return send_response_unsuccessful(res, "Bad password", [INVALID_PASSWORD]);
            }

            const deleted = await User.deleteOne({ name: user.name })
            return send_response_successful(res, "User deleted succefully", deleted);

        } catch (error) {
            return send_response_failed_at(res, "Error at deleting user", error);
        }

    });

    /**
     * Get questions
     */
    app.get("/api/questions", async (req, res) => {
        try {
            const questions = await Question.find();
            return send_response_successful(res, "Questions", questions);
        } catch (err) {
            return send_response_failed_at(res, "Error retrieving questions", err);
        }
    });

}