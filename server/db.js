import mongoose from "mongoose";

// * DB UTILS

const uri = "mongodb+srv://theshadows408:minecraft@cluster0.lhdhwgx.mongodb.net/quizApp?retryWrites=true&w=majority&appName=Cluster0";
export const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log("MongoDB connected ✅");
    } catch (err) {
        console.error("MongoDB connection error ❌", err);
        process.exit(1);
    }
};

