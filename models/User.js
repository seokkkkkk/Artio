const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        profileImage: { type: String, default: "/uploads/default-profile.png" },
        bio: { type: String, maxlength: 150, default: "" },
        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // 팔로워 목록
        following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // 팔로우 목록
        createdAt: {
            type: Date,
            default: Date.now,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
