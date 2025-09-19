import GameSocket from "./GameSocket";


export default function InitSockets(server) {
    server.on("connection", (client) => {

        GameSocket(server, client);

    });
}