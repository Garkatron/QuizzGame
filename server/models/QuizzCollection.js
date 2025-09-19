/**
 * @swagger
 * components:
 *   schemas:
 *     QuizzCollection:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId de la colección
 *           example: 64f6b8d8c3d9e12f7e9c1234
 *         name:
 *           type: string
 *           description: Nombre de la colección
 *           example: Geography Quiz
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Etiquetas de la colección
 *           example: ["geography","capitals"]
 *         owner:
 *           type: string
 *           description: ID del usuario que creó la colección
 *           example: 64f4f9c6a2b1a3f9d7e9b123
 *         questions:
 *           type: array
 *           items:
 *             type: string
 *             description: IDs de las preguntas incluidas
 *             example: ["64f5a9b7c3d9e12f7e9b4567","64f5a9b7c3d9e12f7e9b4568"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *           example: 2025-09-19T12:34:56.789Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *           example: 2025-09-19T12:34:56.789Z
 */


import mongoose from "mongoose";

const quizzCollectionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    tags: [{ type: String }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }]
});

const QuizzCollection = mongoose.model("QuizzCollection", quizzCollectionSchema);
export default QuizzCollection;