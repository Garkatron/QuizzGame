import mongoose from "mongoose";

const tagsSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true }
});

export const Category = mongoose.model("Category", tagsSchema);
