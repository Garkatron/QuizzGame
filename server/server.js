import express from "express";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./db/db.js"
import { fileURLToPath } from "url";
import path from "path";
import { CONFIG } from "./constants.js";
import dotenv from "dotenv";
import userRoutes from "./routes/UserRoutes.js";
import questionRoutes from "./routes/QuestionRoutes.js";
import collectionRoutes from "./routes/CollectionRoutes.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static('public'));
// ? Root endpoint, returns a welcome message.

app.post('/', (req, res) => {
    res.send('<h1>Hello from Deus Quizzes server!</h1>');
});


// ! Temporary solution
app.use("/shared", express.static(path.join(__dirname, "../shared")));

app.listen(app.get("port"), () => {
    console.log(`Server running on port ${app.get("port")}`);
});

app.use("/api/user", userRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/collection", collectionRoutes);

await connectDB();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: `http://localhost:${CONFIG.SERVER_PORT}`,
        methods: ["GET", "POST"],
    },
});



server.listen(CONFIG.SERVER_PORT, () => {
    console.log(`Server running at port ${CONFIG.SERVER_PORT}`);
});



