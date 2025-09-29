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

import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Quizz Api",
            version: "1.0.0"
        }
    },
    apis: [
        "./routes/*.js",
        "./models/*.js"]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

dotenv.config();

const app = express();
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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


app.use("/api/v1/users", userRoutes);
app.use("/api/v1/questions", questionRoutes);
app.use("/api/v1/collections", collectionRoutes);

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

app.listen(app.get("port"), () => {
    console.log(`Server running on port ${app.get("port")}`);
});


