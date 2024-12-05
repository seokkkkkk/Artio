const bcrypt = require("bcrypt");
const User = require("../models/User");

// 특정 사용자 조회 (비밀번호 제외)
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: "사용자를 찾을 수 없습니다.",
            });
        }
        res.status(200).json({ status: "success", data: user });
    } catch (error) {
        res.status(500).json({ status: "fail", message: error.message });
    }
};

// 로그인한 사용자 조회 (비밀번호 제외)
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: "사용자를 찾을 수 없습니다.",
            });
        }
        res.status(200).json({ status: "success", data: user });
    } catch (error) {
        res.status(500).json({ status: "fail", message: error.message });
    }
};

exports.updateCurrentUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const updateData = { ...req.body };

        if (req.file) {
            updateData.profileImage = `/uploads/profile_images/${req.file.filename}`;
        }

        const user = await User.findByIdAndUpdate(userId, updateData, {
            new: true,
            runValidators: true,
        });

        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: "사용자를 찾을 수 없습니다.",
            });
        }

        res.status(200).json({ status: "success", data: user });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// 사용자 정보 수정 (프로필 이미지 포함, 권한 검사 추가)
exports.updateUser = async (req, res) => {
    try {
        if (req.user.id !== req.params.id) {
            return res.status(403).json({
                status: "fail",
                message: "권한이 없습니다.",
            });
        }

        const updateData = { ...req.body };

        if (req.file) {
            updateData.profileImage = `/uploads/profile_images/${req.file.filename}`;
        }

        const user = await User.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: "사용자를 찾을 수 없습니다.",
            });
        }

        res.status(200).json({ status: "success", data: user });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

exports.isFollowing = async (req, res) => {
    try {
        const userId = req.params.userId;
        const currentUser = await User.findById(req.user.id);
        if (!currentUser) {
            return res.status(404).json({
                status: "fail",
                message: "사용자를 찾을 수 없습니다.",
            });
        }

        const isFollowing = currentUser.following.includes(userId);
        res.status(200).json({ status: "success", data: { isFollowing } });
    } catch (error) {
        res.status(500).json({ status: "fail", message: error.message });
    }
};
