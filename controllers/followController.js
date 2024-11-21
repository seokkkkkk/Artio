const findUsers = async (currentUserId, targetUserId) => {
    const userToFollow = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);
    return { userToFollow, currentUser };
};

// 팔로우 기능
exports.followUser = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userToFollow, currentUser } = await findUsers(
            req.user.id,
            req.params.id
        );

        if (!userToFollow) {
            throw new Error("팔로우할 사용자를 찾을 수 없습니다.");
        }

        if (userToFollow.id === currentUser.id) {
            throw new Error("자기 자신을 팔로우할 수 없습니다.");
        }

        if (!currentUser.following.includes(userToFollow.id)) {
            currentUser.following.push(userToFollow.id);
            userToFollow.followers.push(currentUser.id);
        }

        await currentUser.save({ session });
        await userToFollow.save({ session });
        await session.commitTransaction();

        res.status(200).json({ status: "success", message: "팔로우 완료" });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ status: "fail", message: error.message });
    } finally {
        session.endSession();
    }
};

// 언팔로우 기능
exports.unfollowUser = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userToFollow, currentUser } = await findUsers(
            req.user.id,
            req.params.id,
            session
        );

        if (!userToFollow) {
            throw new Error("언팔로우할 사용자를 찾을 수 없습니다.");
        }

        if (userToFollow.id === currentUser.id) {
            throw new Error("자기 자신을 언팔로우할 수 없습니다.");
        }

        // 언팔로우 로직
        currentUser.following.pull(userToFollow.id);
        userToFollow.followers.pull(currentUser.id);

        await currentUser.save({ session });
        await userToFollow.save({ session });
        await session.commitTransaction();

        res.status(200).json({ status: "success", message: "언팔로우 완료" });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ status: "fail", message: error.message });
    } finally {
        session.endSession();
    }
};
