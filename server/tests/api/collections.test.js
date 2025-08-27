import pactum from "pactum";
import http from "http";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import MakeEndpoints from "../../routes/api.js";
import { hash_password } from "../../utils/utils.js";
import { User } from "../../db/models.js";
import { UserPermissions } from "../../constants.js";

let server;
let mongoServer;
let accessToken;

// --- Constantes de referencia ---
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

        EDIT_QUESTION: false,
        DELETE_QUESTION: false,
        CREATE_QUESTION: true,

        CREATE_COLLECTION: true,
        EDIT_COLLECTION: true,
        DELETE_COLLECTION: true,

        EDIT_USER: false,
        DELETE_USER: false,
        CREATE_USER: false,
    },
};

// --- Setup y teardown ---
before(async () => {
    dotenv.config();
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { dbName: "test" });

    // Crear admin directamente en BD
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

describe("Collections + Permissions", () => {

    // --- Registro y login del usuario de prueba ---
    it("should register a new user", async () => {
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

    // --- Modificar permisos del usuario como admin ---
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

    it("should create a collection", async () => {
        await pactum
            .spec()
            .post("/api/collection/create")
            .withHeaders({ Authorization: `Bearer ${accessToken}` })
            .withBody({ user_name: TEST_USER.name, name: "testcollection", tags: [], questions: [] })
            .expectStatus(200);
    });


    it("should edit a collection", async () => {
        await pactum
            .spec()
            .post("/api/collection/edit")
            .withHeaders({ Authorization: `Bearer ${accessToken}` })
            .withBody({ user_name: TEST_USER.name, collection_name: "testcollection", field: "name", value: "testcollectionedited" })
            .expectStatus(200);
    });


    it("should delete a collection", async () => {
        await pactum
            .spec()
            .post("/api/collection/delete")
            .withHeaders({ Authorization: `Bearer ${accessToken}` })
            .withBody({ user_name: TEST_USER.name, collection_name: "testcollectionedited" })
            .expectStatus(200);
    });
});