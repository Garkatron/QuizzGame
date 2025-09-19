
import { CLIENT_EVENTS, SERVER_EVENTS } from "../../shared/common.js";
import Room from "./room.js";
import { Question, User } from "../db/models.js"

let rooms = {};
const exists_room = (room_name) => rooms[room_name] || null;

const random_question = async () => {
    const questions = await Question.find();
    const index = Math.floor(Math.random() * questions.length);
    return questions[index];
};


export default function GameSocket(server, client) {

    client.on(CLIENT_EVENTS.CREATE_ROOM, (user_name, room_name) => {
        const room = exists_room(room_name);
        if (room) {
            client.emit(SERVER_EVENTS.ALREADY_EXISTS_ROOM, room_name);
            return;
        }
        rooms[room_name] = new Room(room_name, user_name);
        client.data.user_name = user_name;
        client.data.room_name = room_name;
        client.join(room_name);
        rooms[room_name].join(user_name);
        server.to(room_name).emit(SERVER_EVENTS.GAME_JOINED_USER, user_name);
    });

    /**
     * 
     */
    client.on(CLIENT_EVENTS.CONNECT, (user_name, room_name) => {
        client.data.user_name = user_name;
        client.data.room_name = room_name;
        const room = exists_room(room_name);
        if (!room) {
            client.emit(SERVER_EVENTS.ROOM_NOT_FOUND);
            return;
        }

        if (client.rooms.has(room_name)) {
            client.emit(SERVER_EVENTS.ALREADY_IN_ROOM, room_name);
            return;
        }
        client.join(room_name);
        room.join(user_name);
        server.to(room_name).emit(SERVER_EVENTS.GAME_JOINED_USER, user_name);
    });

    /**
     * 
     */
    client.on(CLIENT_EVENTS.START_GAME, async (user_name, room_name) => {
        const room = exists_room(room_name);
        if (!room) {
            client.emit(SERVER_EVENTS.ROOM_NOT_FOUND);
            return;
        }
        const question_obj = await random_question();
        room.start(question_obj.question, question_obj.options, question_obj.answer);
        server.to(room_name).emit(SERVER_EVENTS.GAME_STARTED, room_name, room.current_question);

        if (room.finished) {
            server.to(room_name).emit(SERVER_EVENTS.GAME_FINISHED, room_name, room.winner);
            delete rooms[room_name];
            return;
        }
    });

    /**
     * 
     */
    client.on("disconnect", () => {
        const { user_name, room_name } = client.data;
        if (!room_name) return;

        const room = exists_room(room_name);
        if (!room) return;

        room.kick(user_name);
        server.to(room_name).emit(SERVER_EVENTS.USER_LEFT, user_name);

        if (room.finished) {
            server.to(room_name).emit(SERVER_EVENTS.GAME_FINISHED, room_name, room.winner);
            delete rooms[room_name];
            return;
        }
    });

    /**
     * 
     */
    client.on(CLIENT_EVENTS.DISCONNECT, (user_name, room_name) => {
        const room = exists_room(room_name);
        if (!room) return;

        room.kick(user_name);
        server.to(room_name).emit(SERVER_EVENTS.USER_LEFT, user_name);
    });

    /**
     * 
     */
    client.on(CLIENT_EVENTS.CLOSE_GAME, (user_name, room_name) => {

        const room = exists_room(room_name);
        if (!room) {
            client.emit(SERVER_EVENTS.ROOM_NOT_FOUND);
            return;
        }

        if (room.close(user_name)) {
            server.to(room_name).emit(SERVER_EVENTS.GAME_FINISHED, room_name);
            delete rooms[room_name];
            return;
        }

        client.emit(SERVER_EVENTS.ONLY_OWNER);
    });

    /**
     * 
     */
    client.on(CLIENT_EVENTS.ANSWER, async (user_name, room_name, anwser) => {
        const room = exists_room(room_name);
        if (!room) {
            client.emit(SERVER_EVENTS.ROOM_NOT_FOUND);
            return;
        }

        const _is_correct = room.user_answer(user_name, anwser);
        server.to(room_name).emit(SERVER_EVENTS.USER_ANSWER, user_name, anwser);


        if (room.finished) {
            server.to(room_name).emit(SERVER_EVENTS.GAME_FINISHED, room_name, room.winner);

            delete rooms[room_name];
            return;
        }

        if (room.all_answered()) {
            server.to(room_name).emit(SERVER_EVENTS.SEND_USERS_ANSWERS, room.answers_by_player);
            const question_obj = await random_question();

            setTimeout(() => {
                room.next_question(question_obj.question, question_obj.options, question_obj.answer)
                server.to(room_name).emit(SERVER_EVENTS.NEXT_QUESTION, room.current_question);
            }, 1000);

            return;
        }
    });

}