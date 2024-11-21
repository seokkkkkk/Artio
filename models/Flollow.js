const mongoose = require("mongoose");

const followSchema = new mongoose.Schema(
    {
        follower: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        following: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

// 인덱스 설정으로 동일한 팔로우 관계의 중복 방지
followSchema.index({ follower: 1, following: 1 }, { unique: true });

module.exports = mongoose.model("Follow", followSchema);
