const bcrypt = require("bcrypt");

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
