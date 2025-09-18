import mongoose from "mongoose";

const tagsSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true }
});

const Category = mongoose.model("Category", tagsSchema);
export default Category;