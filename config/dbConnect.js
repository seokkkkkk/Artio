const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async () => {
    try {
        const uri = process.env.DB_CONNECT;
        if (!uri) {
            throw new Error("MongoDB URI is undefined. Check your .env file.");
        }
        await mongoose.connect(uri);
        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1);
    }
};

module.exports = dbConnect;
