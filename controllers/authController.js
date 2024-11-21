const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const sendTokenResponse = (user, statusCode, res) => {
    const token = createToken(user._id);
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 1일 동안 유효
    });
    res.status(statusCode).json({ status: "success", data: user });
};

// 회원가입
exports.signup = async (req, res) => {
    try {
        const { username, id, password, confirmPassword, bio } = req.body;

        // 비밀번호 확인
        if (password !== confirmPassword) {
            return res.status(400).json({
                status: "fail",
                message: "비밀번호가 일치하지 않습니다.",
            });
        }

        // ID 중복 확인
        const existingUser = await User.findOne({ id });
        if (existingUser) {
            return res.status(400).json({
                status: "fail",
                message: "이미 사용 중인 아이디입니다.",
            });
        }

        // 사용자 생성
        const newUser = await User.create({
            username,
            id,
            password,
            bio,
        });

        sendTokenResponse(newUser, 201, res);
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.message,
        });
    }
};

// 로그인
exports.login = async (req, res) => {
    try {
        const { id, password } = req.body;
        if (!id || !password) {
            return res.status(400).json({
                status: "fail",
                message: "아이디와 비밀번호를 입력하세요.",
            });
        }

        const user = await User.findOne({ id }).select("+password");

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                status: "fail",
                message: "잘못된 아이디 또는 비밀번호입니다.",
            });
        }

        user.password = undefined; // 비밀번호 제거
        sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(500).json({ status: "fail", message: error.message });
    }
};

// 로그아웃
exports.logout = (req, res) => {
    res.cookie("jwt", "loggedout", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 10 * 1000, // 쿠키를 빠르게 만료시켜 로그아웃 처리
    });
    res.status(200).json({ status: "success", message: "로그아웃되었습니다." });
};

// 회원 탈퇴
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: "사용자를 찾을 수 없습니다.",
            });
        }

        await User.findByIdAndDelete(userId);
        res.status(204).json({ status: "success", data: null });
    } catch (error) {
        res.status(500).json({ status: "fail", message: error.message });
    }
};
