import express from "express";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./db.js"
import MakeEndpoints from "./api.js";
import { fileURLToPath } from "url";
import path from "path";
import MultiplayerLogic from "./multiplayer.js"

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

MakeEndpoints(app);

// * SOCKET IO
const PORT = 3000;
const io = new Server(server, {
    cors: {
        origin: `http://localhost:${PORT}`,
        methods: ["GET", "POST"],
    },
});


MultiplayerLogic(io);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



