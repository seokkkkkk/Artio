const User = require("../models/User");

const findUsers = async (currentUserId, targetUserId) => {
    const userToFollow = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);
    return { userToFollow, currentUser };
};

// 팔로우 기능
exports.followUser = async (req, res) => {
    try {
        const { userToFollow, currentUser } = await findUsers(
            req.user._id,
            req.params.id
        );

        if (!userToFollow) {
            return res.status(404).json({
                status: "fail",
                message: "팔로우할 사용자를 찾을 수 없습니다.",
            });
        }

        if (userToFollow.id === currentUser.id) {
            return res.status(400).json({
                status: "fail",
                message: "자기 자신을 팔로우할 수 없습니다.",
            });
        }

        if (!currentUser.following.includes(userToFollow.id)) {
            currentUser.following.push(userToFollow.id);
            userToFollow.followers.push(currentUser.id);

            await currentUser.save();
            await userToFollow.save();
        }

        res.status(200).json({ status: "success", message: "팔로우 완료" });
    } catch (error) {
        res.status(500).json({ status: "fail", message: error.message });
    }
};

// 언팔로우 기능
exports.unfollowUser = async (req, res) => {
    try {
        const { userToFollow, currentUser } = await findUsers(
            req.user._id,
            req.params.id
        );

        if (!userToFollow) {
            return res.status(404).json({
                status: "fail",
                message: "언팔로우할 사용자를 찾을 수 없습니다.",
            });
        }

        if (userToFollow.id === currentUser.id) {
            return res.status(400).json({
                status: "fail",
                message: "자기 자신을 언팔로우할 수 없습니다.",
            });
        }

        if (currentUser.following.includes(userToFollow.id)) {
            currentUser.following.pull(userToFollow.id);
            userToFollow.followers.pull(currentUser.id);

            await currentUser.save();
            await userToFollow.save();
        }

        res.status(200).json({ status: "success", message: "언팔로우 완료" });
    } catch (error) {
        res.status(500).json({ status: "fail", message: error.message });
    }
};
