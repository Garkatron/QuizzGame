import express from "express";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./db/db.js"
import MakeEndpoints from "./routes/api.js";
import { fileURLToPath } from "url";
import path from "path";
import MultiplayerLogic from "./game/multiplayer.js"
import { SERVER_PORT } from "./constants.js";
import { dotenv } from "dotenv";
import { doesNotMatch } from "assert";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.use(express.static(path.join(__dirname, "../test_client"))); // Test client html
app.use(express.static('public'));

// Temporary solution
app.use("/shared", express.static(path.join(__dirname, "../shared")));

app.listen(app.get("port"), () => {
    console.log(`Server running on port ${app.get("port")}`);
});

await connectDB();
const server = http.createServer(app);

MakeEndpoints(app);

const io = new Server(server, {
    cors: {
        origin: `http://localhost:${SERVER_PORT}`,
        methods: ["GET", "POST"],
    },
});

MultiplayerLogic(io);


server.listen(SERVER_PORT, () => {
    console.log(`Server running at port ${SERVER_PORT}`);
});

// ! TEST
export default app;


