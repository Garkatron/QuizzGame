// =============================
// CLIENT EVENTS
// =============================
export const CLIENT_EVENTS = {
    CREATE_ROOM: "CREATE_ROOM",
    CONNECT: "CLIENT_CONNECT",
    DISCONNECT: "CLIENT_DISCONNECT",
    ANSWER: "CLIENT_ANSWER",
    CLOSE_GAME: "CLIENT_CLOSE_GAME",
    START_GAME: "CLIENT_START_GAME"
};

// =============================
// SERVER EVENTS
// =============================
export const SERVER_EVENTS = {
    // * Questions & Answers
    ANSWER_QUESTION: "SERVER_CURRENT_ANSWER",        // ? Sends the correct answer for the current question
    SEND_OPTIONS: "SERVER_SEND_OPTIONS",             // ? Sends all possible answer options for the current question
    SEND_USERS_ANSWERS: "SERVER_SEND_USERS_ANSWERS", // ? Sends all answers submitted by the players
    USER_ANSWER: "SERVER_SEND_USER_ANSWER",          // ? Notifies when a player submits an answer

    // * Game Flow
    NEXT_QUESTION: "SERVER_NEXT_QUESTION",           // ? Indicates that the next question is starting
    GAME_STARTED: "SERVER_GAME_STARTED",             // ? Notifies that the game has started
    GAME_FINISHED: "SERVER_GAME_FINISHED",           // ? Notifies that the game has ended

    // * Player Management
    GAME_JOINED_USER: "SERVER_GAME_JOINED_USER",     // ? Notifies when a user joins the room
    USER_LEFT: "SERVER_USER_LEFT",                   // ? Notifies when a user leaves the room

    // * Errors & Validations
    ALREADY_EXISTS_ROOM: "SERVER_ALREADY_EXISTS_ROOM", // ? Warns when a room with the same name already exists
    ROOM_NOT_FOUND: "SERVER_ROOM_NOT_FOUND",           // ? Warns when the room cannot be found
    ONLY_OWNER: "SERVER_ONLY_OWNER",                   // ? Warns when only the owner can perform the action
    ALREADY_IN_ROOM: "SERVER_ALREADY_IN_ROOM"          // ? Warns when the user is already in the room
};
