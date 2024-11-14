const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.signup = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.json({ message: "User registered successfully" });
    } catch (error) {
        console.error("회원가입 중 오류 발생:", error);
        res.status(500).json({
            message:
                "회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username }).select("+password");
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        req.session.user = { id: user._id, username: user.username };
        res.json({ message: "Logged in successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.json({ message: "Logged out successfully" });
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 });
        res.json(users);
    } catch (error) {
        console.error("유저 리스트를 가져오는 중 오류 발생:", error);
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id, { password: 0 });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateUserProfile = async (req, res) => {
    const { id } = req.params;
    const { username } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.deletedAt) {
            return res
                .status(400)
                .json({ message: "User account is deactivated" });
        }

        // 사용자명 업데이트
        user.username = username || user.username;
        await user.save();

        res.json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.deletedAt) {
            return res
                .status(400)
                .json({ message: "User account is already deactivated" });
        }

        // Soft delete: deletedAt 필드에 현재 시간 저장
        user.deletedAt = new Date();
        await user.save();

        req.session.destroy();
        res.json({ message: "User account deactivated successfully" });
    } catch (error) {
        console.error("Error deactivating account:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getProfile = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "로그인이 필요합니다." });
    }

    try {
        const user = await User.findById(req.session.user.id);
        if (!user) {
            return res
                .status(404)
                .json({ error: "사용자를 찾을 수 없습니다." });
        }

        res.json({
            id: user._id,
            username: user.username,
            createdAt: user.createdAt,
        });
    } catch (error) {
        console.error("프로필 정보를 가져오는 중 오류 발생:", error);
        res.status(500).json({ error: "서버 오류가 발생했습니다." });
    }
};
