/**
 * @swagger
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       required:
 *         - question
 *         - options
 *         - answer
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId de la pregunta
 *           example: 64f5a9b7c3d9e12f7e9b4567
 *         question:
 *           type: string
 *           description: Texto de la pregunta
 *           example: What is the capital of France?
 *         options:
 *           type: array
 *           items:
 *             type: string
 *           description: Opciones posibles para la pregunta (mínimo 2)
 *           example: ["Paris", "London", "Berlin", "Rome"]
 *         answer:
 *           type: string
 *           description: Respuesta correcta de la pregunta
 *           example: Paris
 *         owner:
 *           type: string
 *           description: ID del usuario que creó la pregunta
 *           example: 64f4f9c6a2b1a3f9d7e9b123
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Etiquetas de la pregunta
 *           example: ["geography", "capital"]
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

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true, trim: true },
    options: { type: [String], required: true, validate: v => v.length >= 2 },
    answer: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tags: [{ type: String }],
});
const Question = mongoose.model("Question", questionSchema);
export default Question;
