import pactum from "pactum";
import http from "http";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import MakeEndpoints from "../../routes/api.js";
import { hash_password } from "../../utils/utils.js";
import { User, Question } from "../../db/models.js";
import { UserPermissions } from "../../constants.js";

let server;
let mongoServer;
let accessToken;

const ADMIN_USER = {
    name: "admin",
    email: "admin@example.com",
    password: "admin1234",
    permissions: {
        ADMIN: true,

        EDIT_QUESTION: true,
        DELETE_QUESTION: true,
        CREATE_QUESTION: true,

        CREATE_COLLECTION: true,
        EDIT_COLLECTION: true,
        DELETE_COLLECTION: true,

        EDIT_USER: true,
        DELETE_USER: true,
        CREATE_USER: true,
    },
};
const TEST_USER = {
    name: "newuser",
    email: "newuser@example.com",
    password: "12345678",
    permissions: {
        ADMIN: false,
        EDIT_QUESTION: true,
        DELETE_QUESTION: true,
        CREATE_QUESTION: true,
    },
};

before(async () => {
    dotenv.config();
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { dbName: "test" });

    const adminPassword = await hash_password(ADMIN_USER.password);
    await User.create({
        name: ADMIN_USER.name,
        email: ADMIN_USER.email,
        password: adminPassword,
        permissions: ADMIN_USER.permissions,
    });

    const app = express();
    app.use(express.json());
    MakeEndpoints(app);
    server = http.createServer(app).listen(0);
    const port = server.address().port;
    pactum.request.setBaseUrl(`http://localhost:${port}`);
});

after(async () => {
    await new Promise((resolve) => server.close(resolve));
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("Questions + Permissions", () => {
    let questionId;

    it("should register a new test user", async () => {
        await pactum
            .spec()
            .post("/api/auth/register")
            .withBody(TEST_USER)
            .expectStatus(200)
            .expectJsonLike({
                success: true,
                message: /.+/,
                data: { id: /.+/, name: TEST_USER.name, email: TEST_USER.email },
            });
    });

    it("should login admin user", async () => {
        const res = await pactum
            .spec()
            .post("/api/auth/login")
            .withBody({ name: ADMIN_USER.name, password: ADMIN_USER.password })
            .expectStatus(200)
            .expectJsonLike({
                success: true,
                message: /.+/,
                data: {
                    user: { id: /.+/, name: ADMIN_USER.name, email: ADMIN_USER.email },
                    accessToken: /.+/,
                },
            });
        accessToken = res.body.data.accessToken;
    });

    it("should allow admin to modify test user permissions", async () => {
        await pactum
            .spec()
            .post("/api/auth/edit")
            .withHeaders({ Authorization: `Bearer ${accessToken}` })
            .withBody({ name: TEST_USER.name, field: "permissions", value: TEST_USER.permissions })
            .expectStatus(200)
            .expectJsonLike({ success: true, message: "User edited successfully" });
    });


    it("should login the test user", async () => {
        const res = await pactum
            .spec()
            .post("/api/auth/login")
            .withBody({ name: TEST_USER.name, password: TEST_USER.password })
            .expectStatus(200);
        accessToken = res.body.data.accessToken;
    });

    it("should create a question", async () => {
        const questionData = {
            user_name: TEST_USER.name,
            question_text: "What is 2+2?",
            options: ["3", "4", "5"],
            answer: "4",
            tags: ["math"],
        };

        const res = await pactum
            .spec()
            .post("/api/question/create")
            .withHeaders({ Authorization: `Bearer ${accessToken}` })
            .withBody(questionData)
            .expectStatus(200);

        questionId = res.body.data._id;
    });

    it("should edit the question", async () => {
        await pactum
            .spec()
            .post("/api/question/edit")
            .withHeaders({ Authorization: `Bearer ${accessToken}` })
            .withBody({
                id: questionId,
                field: "question",
                value: "What is 3+3?",
            })
            .expectStatus(200)
            .expectJsonLike({ success: true, message: "Question edited successfully" });
    });

    it("should delete the question", async () => {
        await pactum
            .spec()
            .post("/api/question/delete")
            .withHeaders({ Authorization: `Bearer ${accessToken}` })
            .withBody({ id: questionId })
            .expectStatus(200)
            .expectJsonLike({ success: true, message: "Question deleted successfully" });
    });
});
