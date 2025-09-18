import mongoose from "mongoose";

const quizzCollectionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    tags: [{ type: String }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }]
});

const QuizzCollection = mongoose.model("QuizzCollection", quizzCollectionSchema);
export default QuizzCollection;