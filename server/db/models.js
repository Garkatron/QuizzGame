import mongoose from "mongoose";

// * SCHEMAS

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

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true, trim: true },
    options: { type: [String], required: true, validate: v => v.length >= 2 },
    answer: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tags: [{ type: String }],
});

const quizzCollectionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    tags: [{ type: String }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }]
});

const tagsSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true }
});

// * MODELS

/** A User with permissions */
export const User = mongoose.model("User", userSchema);
/** A question */
export const Question = mongoose.model("Question", questionSchema);
/** Collection of questions id */
export const QuizzCollection = mongoose.model("QuizzCollection", quizzCollectionSchema);
/** A category */
export const Category = mongoose.model("Category", tagsSchema);
