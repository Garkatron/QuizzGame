/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId del usuario
 *           example: 64f4f9c6a2b1a3f9d7e9b123
 *         name:
 *           type: string
 *           description: Nombre del usuario
 *           example: Alice
 *         email:
 *           type: string
 *           description: Email único del usuario
 *           example: alice@example.com
 *         score:
 *           type: integer
 *           description: Puntuación del usuario
 *           example: 120
 *         permissions:
 *           type: object
 *           description: Permisos del usuario
 *           example: { "ADMIN": false, "EDIT_USER": true }
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

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    score: { type: Number, default: 0, min: 0 },
    permissions: {
        type: Map,
        of: Boolean,
        default: {}
    }
});

// ? Avoid show password when get transformed to JSON.
userSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.password;
        return ret;
    }
});

const User = mongoose.model("User", userSchema);
export default User;