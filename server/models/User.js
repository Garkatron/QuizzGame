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

const User = mongoose.model("User", userSchema);
export default User;