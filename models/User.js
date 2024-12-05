const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "사용자 이름은 필수 항목입니다."],
            unique: true,
            trim: true,
            minlength: [2, "사용자 이름은 최소 2글자 이상이어야 합니다."],
        },
        userId: {
            type: String,
            required: [true, "아이디는 필수 항목입니다."],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "비밀번호는 필수 항목입니다."],
            minlength: [4, "비밀번호는 최소 4글자 이상이어야 합니다."],
        },
        profileImage: {
            type: String,
            default: "/uploads/profile_images/default-profile.png",
        },
        bio: {
            type: String,
            required: [true, "소개글은 필수 항목입니다."],
            maxlength: [300, "소개글은 최대 300자까지 가능합니다."],
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

// 비밀번호 해시 처리
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// 비밀번호 검증 메소드
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model("User", userSchema);
