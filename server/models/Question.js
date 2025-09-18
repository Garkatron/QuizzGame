import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true, trim: true },
    options: { type: [String], required: true, validate: v => v.length >= 2 },
    answer: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tags: [{ type: String }],
});
export const Question = mongoose.model("Question", questionSchema);

