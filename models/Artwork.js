const mongoose = require("mongoose");

const artworkSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "작품 제목은 필수 항목입니다."],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            maxlength: [1000, "작품 설명은 최대 1000자까지 가능합니다."],
        },
        imageUrl: {
            type: String,
            required: [true, "작품 이미지는 필수 항목입니다."],
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        price: {
            type: Number,
            min: [0, "가격은 0 이상이어야 합니다."],
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        views: {
            type: Number,
            default: 0,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                text: {
                    type: String,
                    required: [true, "댓글 내용은 필수 항목입니다."],
                    maxlength: [500, "댓글은 최대 500자까지 가능합니다."],
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    { timestamps: true }
);

// 조회 수 증가 메소드
artworkSchema.methods.incrementViews = async function () {
    this.views += 1;
    await this.save();
};

module.exports = mongoose.model("Artwork", artworkSchema);
