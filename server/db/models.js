import mongoose from "mongoose";

// * SCHEMAS

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    score: { type: Number, default: 0 },
    permissions: {
        type: Map,
        of: Boolean,
        default: {}
    }
});

const questionSchema = new mongoose.Schema({
    question: String,
    options: [String],
    answer: String
});

const permissionsTable = new mongoose.Schema({
    user_name: String,
    options: [String],
});

// * MODELS

export const Question = mongoose.model("Question", questionSchema);
export const User = mongoose.model("User", userSchema);
