import mongoose from "mongoose";

// * SCHEMAS

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    score: { type: Number, default: 0 }
});

const questionSchema = new mongoose.Schema({
    question: String,
    options: [String],
    answer: String
});

// * MODELS

export const Question = mongoose.model("Question", questionSchema);
export const User = mongoose.model("User", userSchema);