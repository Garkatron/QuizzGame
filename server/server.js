import express from "express";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./db.js"
import { Question, User } from "./models.js"
import { compare_password, send_response_failed_at, hash_password, send_response_not_found, send_response_successful, send_response_unsuccessful, validate_password, validate_email, validate_name } from "./utils.js"
import { CLIENT_EVENTS, SERVER_EVENTS } from "../shared/common.js";
import { fileURLToPath } from "url";
import path from "path";


// ? Setup

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "../test_client")));
app.use(express.static('public'));
app.use("/shared", express.static(path.join(__dirname, "../shared")));

app.set("port", 5050);
app.listen(app.get("port"), () => {
    console.log(`Server running on port ${app.get("port")}`);
});

await connectDB();

const server = http.createServer(app);

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

        send_response_successful(res, "User created succefully", { id: newUser._id, name: newUser.name, email: newUser.email })

    } catch (error) {
        send_response_failed_at(res, "Error at creating user", error);
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

        send_response_successful(res, "User exists", user);

    } catch (error) {
        send_response_failed_at(res, "Error searching user", error);
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
        send_response_successful(res, "User deleted succefully", deleted);

    } catch (error) {
        send_response_failed_at(res, "Error at deleting user", error);
    }

});
const PORT = 3000;

// * SOCKET IO
const io = new Server(server, {
    cors: {
        origin: `http://localhost:${PORT}`,
        methods: ["GET", "POST"],
    },
});
class Room {
    constructor(name, owner, questions = 1, users = []) {
        this.name = name;
        this.owner = owner;
        this.points = {};
        users.forEach((u) => {
            this.points[u] = 0;
        });

        this.started = false;
        this.finished = false;
        this.questions_remaining = questions;
        this.current_question = "";
        this.answer = "";
        this.winner = "";
        this.debug = true;
    }

    log(...messages) {
        if (!this.debug) return;
        console.log("---------------------------------")
        console.info(`From ${this.name} >\n`, messages);
    }

    join(user_name) {
        this.points[user_name] = 0;
        this.log(`Joined: ${user_name}`);
    }

    kick(user_name) {
        delete this.points[user_name];
        if (user_name === this.owner) this.finished = true;
        this.log(`Kicked: ${user_name}`);
    }

    start() {
        this.started = true;
        this.log(`Started: ${this.name} with owner ${this.owner}`);
    }

    next_question() {
        this.questions_remaining--;
        if (this.questions_remaining == 0) {
            this.finished = true;
            this.log(`Finished game`);
        }
        this.log(`Questions remaining: ${this.questions_remaining}`);
    }

    calc_winner() {
        let maxScore = -Infinity;
        let winner = null;

        for (const [name, score] of Object.entries(this.points)) {
            if (score > maxScore) {
                maxScore = score;
                winner = name;
            }
        }
        this.winner = winner;
        return winner;
    }

    user_answer(user_name, user_answer) {
        this.log(`Answer: ${user_answer}`);
        if (user_answer === this.answer) {
            this.points[user_name] = (this.points[user_name] || 0) + 1;

            this.calc_winner();
            this.next_question();

            this.log(`Correct anwer`);
            this.log(`Leader list: ${this.points}`);
            return true;
        }
        return false;
    }

    close(user_name) {
        const a = user_name === this.owner;
        if (a) {
            this.finished = true
            this.log(`Closed the game: ${this.owner}, room: ${this.name}`);
        };

        return a;
    }


}
let rooms = {};

function exists_room(room_name) {
    if (!(room_name in rooms)) return null;
    return rooms[room_name];
}


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    /**
     * 
     */
    socket.on(CLIENT_EVENTS.CREATE_ROOM, (user_name, room_name) => {
        const room = exists_room(room_name);
        if (room) {
            socket.emit(SERVER_EVENTS.ALREADY_EXISTS_ROOM, room_name);
            return;
        }
        rooms[room_name] = new Room(room_name, user_name);
        socket.data.user_name = user_name;
        socket.data.room_name = room_name;
        socket.join(room_name);
        rooms[room_name].join(user_name);
        io.to(room_name).emit(SERVER_EVENTS.GAME_JOINED_USER, user_name);
    });

    /**
     * 
     */
    socket.on(CLIENT_EVENTS.CONNECT, (user_name, room_name) => {
        socket.data.user_name = user_name;
        socket.data.room_name = room_name;
        const room = exists_room(room_name);
        if (!room) {
            socket.emit(SERVER_EVENTS.ROOM_NOT_FOUND);
            return;
        }

        if (socket.rooms.has(room_name)) {
            socket.emit(SERVER_EVENTS.ALREADY_IN_ROOM, room_name);
            return;
        }
        socket.join(room_name);
        room.join(user_name);
        io.to(room_name).emit(SERVER_EVENTS.GAME_JOINED_USER, user_name);
    });

    /**
     * 
     */
    socket.on(CLIENT_EVENTS.START_GAME, (user_name, room_name) => {
        const room = exists_room(room_name);
        if (!room) {
            socket.emit(SERVER_EVENTS.ROOM_NOT_FOUND);
            return;
        }
        room.start();
        io.to(room_name).emit(SERVER_EVENTS.GAME_STARTED, room_name);

        if (room.finished) {
            io.to(room_name).emit(SERVER_EVENTS.GAME_FINISHED, room_name, room.winner);
            delete rooms[room_name];
            return;
        }
    });

    /**
     * 
     */
    socket.on("disconnect", () => {
        const { user_name, room_name } = socket.data;
        if (!room_name) return;

        const room = exists_room(room_name);
        if (!room) return;

        room.kick(user_name);
        io.to(room_name).emit(SERVER_EVENTS.USER_LEFT, user_name);

        if (room.finished) {
            io.to(room_name).emit(SERVER_EVENTS.GAME_FINISHED, room_name, room.winner);
            delete rooms[room_name];
            return;
        }
    });

    /**
     * 
     */
    socket.on(CLIENT_EVENTS.DISCONNECT, (user_name, room_name) => {
        const room = exists_room(room_name);
        if (!room) return;

        room.kick(user_name);
        io.to(room_name).emit(SERVER_EVENTS.USER_LEFT, user_name);
    });

    /**
     * 
     */
    socket.on(CLIENT_EVENTS.CLOSE_GAME, (user_name, room_name) => {

        const room = exists_room(room_name);
        if (!room) {
            socket.emit(SERVER_EVENTS.ROOM_NOT_FOUND);
            return;
        }

        if (room.close(user_name)) {
            io.to(room_name).emit(SERVER_EVENTS.GAME_FINISHED, room_name);
            delete rooms[room_name];
            return;
        }

        socket.emit(SERVER_EVENTS.ONLY_OWNER);
    });

    /**
     * 
     */
    socket.on(CLIENT_EVENTS.ANSWER, (user_name, room_name, anwser) => {
        const room = exists_room(room_name);
        if (!room) {
            socket.emit(SERVER_EVENTS.ROOM_NOT_FOUND);
            return;
        }
        room.user_answer(user_name, anwser);
        io.to(room_name).emit(SERVER_EVENTS.USER_ANSWER, user_name, anwser);
        if (room.finished) {
            io.to(room_name).emit(SERVER_EVENTS.GAME_FINISHED, room_name, room.winner);
            delete rooms[room_name];
            return;
        }
    });
});

