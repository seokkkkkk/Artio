const Artwork = require("../models/Artwork");

// 모든 작품 조회
exports.getAllArtworks = async (req, res) => {
    try {
        const artworks = await Artwork.find().populate(
            "createdBy",
            "username profileImage"
        );
        res.status(200).json({ status: "success", data: artworks });
    } catch (error) {
        res.status(500).json({ status: "fail", message: error.message });
    }
};

// 특정 작품 조회
exports.getArtworkById = async (req, res) => {
    try {
        const artwork = await Artwork.findById(req.params.id).populate(
            "createdBy",
            "username profileImage"
        );
        if (!artwork)
            return res
                .status(404)
                .json({ status: "fail", message: "작품을 찾을 수 없습니다." });
        res.status(200).json({ status: "success", data: artwork });
    } catch (error) {
        res.status(500).json({ status: "fail", message: error.message });
    }
};

// 작품 생성
exports.createArtwork = async (req, res) => {
    try {
        req.body.createdBy = req.user.id; // 사용자가 인증된 경우 사용자 ID 추가
        const newArtwork = await Artwork.create(req.body);
        res.status(201).json({ status: "success", data: newArtwork });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// 작품 수정
exports.updateArtwork = async (req, res) => {
    try {
        const artwork = await Artwork.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );
        if (!artwork)
            return res
                .status(404)
                .json({ status: "fail", message: "작품을 찾을 수 없습니다." });
        if (artwork.createdBy.toString() !== req.user.id) {
            return res
                .status(403)
                .json({ status: "fail", message: "수정 권한이 없습니다." });
        }
        res.status(200).json({ status: "success", data: artwork });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// 작품 삭제
exports.deleteArtwork = async (req, res) => {
    try {
        const artwork = await Artwork.findByIdAndDelete(req.params.id);
        if (!artwork)
            return res
                .status(404)
                .json({ status: "fail", message: "작품을 찾을 수 없습니다." });
        res.status(204).json({ status: "success", data: null });
    } catch (error) {
        res.status(500).json({ status: "fail", message: error.message });
    }
};

// 댓글 추가
exports.addComment = async (req, res) => {
    try {
        const artwork = await Artwork.findById(req.params.id);
        if (!artwork)
            return res.status(404).json({
                status: "fail",
                message: "작품을 찾을 수 없습니다.",
            });

        const newComment = {
            user: req.user.id,
            text: req.body.text,
        };

        artwork.comments.push(newComment);
        await artwork.save();

        res.status(201).json({ status: "success", data: artwork });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// 댓글 삭제
exports.deleteComment = async (req, res) => {
    try {
        const artwork = await Artwork.findById(req.params.artworkId);
        if (!artwork)
            return res.status(404).json({
                status: "fail",
                message: "작품을 찾을 수 없습니다.",
            });

        const comment = artwork.comments.id(req.params.commentId);
        if (!comment)
            return res.status(404).json({
                status: "fail",
                message: "댓글을 찾을 수 없습니다.",
            });

        // 댓글 작성자와 요청한 사용자가 같은지 확인
        if (comment.user.toString() !== req.user.id) {
            return res
                .status(403)
                .json({ status: "fail", message: "삭제 권한이 없습니다." });
        }

        comment.remove();
        await artwork.save();

        res.status(204).json({ status: "success", data: null });
    } catch (error) {
        res.status(500).json({ status: "fail", message: error.message });
    }
};

// 좋아요 추가/취소
exports.toggleLike = async (req, res) => {
    try {
        const artwork = await Artwork.findById(req.params.id);
        if (!artwork)
            return res.status(404).json({
                status: "fail",
                message: "작품을 찾을 수 없습니다.",
            });

        const likeIndex = artwork.likes.indexOf(req.user.id);

        if (likeIndex === -1) {
            // 좋아요 추가
            artwork.likes.push(req.user.id);
        } else {
            // 좋아요 취소
            artwork.likes.splice(likeIndex, 1);
        }

        await artwork.save();

        res.status(200).json({ status: "success", data: artwork });
    } catch (error) {
        res.status(500).json({ status: "fail", message: error.message });
    }
};
