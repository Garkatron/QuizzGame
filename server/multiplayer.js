import { CLIENT_EVENTS, SERVER_EVENTS } from "../shared/common.js";
import Room from "./room.js";
import { Question, User } from "./models.js"

let rooms = {};
const exists_room = (room_name) => rooms[room_name] || null;

const random_question = async () => {
    const questions = await Question.find();
    const index = Math.floor(Math.random() * questions.length);
    return questions[index];
};

export default function MultiplayerLogic(io) {
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
        socket.on(CLIENT_EVENTS.START_GAME, async (user_name, room_name) => {
            const room = exists_room(room_name);
            if (!room) {
                socket.emit(SERVER_EVENTS.ROOM_NOT_FOUND);
                return;
            }
            const question_obj = await random_question();
            room.start(question_obj.question, question_obj.options, question_obj.answer);
            io.to(room_name).emit(SERVER_EVENTS.GAME_STARTED, room_name, room.current_question);

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
        socket.on(CLIENT_EVENTS.ANSWER, async (user_name, room_name, anwser) => {
            const room = exists_room(room_name);
            if (!room) {
                socket.emit(SERVER_EVENTS.ROOM_NOT_FOUND);
                return;
            }

            const _is_correct = room.user_answer(user_name, anwser);
            io.to(room_name).emit(SERVER_EVENTS.USER_ANSWER, user_name, anwser);


            if (room.finished) {
                io.to(room_name).emit(SERVER_EVENTS.GAME_FINISHED, room_name, room.winner);

                delete rooms[room_name];
                return;
            }

            if (room.all_answered()) {
                io.to(room_name).emit(SERVER_EVENTS.SEND_USERS_ANSWERS, room.answers_by_player);
                const question_obj = await random_question();

                setTimeout(() => {
                    room.next_question(question_obj.question, question_obj.options, question_obj.answer)
                    io.to(room_name).emit(SERVER_EVENTS.NEXT_QUESTION, room.current_question);
                }, 1000);

                return;
            }
        });
    });
}