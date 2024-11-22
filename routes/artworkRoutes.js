const express = require("express");
const artworkController = require("../controllers/artworkController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router
    .route("/")
    .get(artworkController.getAllArtworks)
    .post(authMiddleware.protect, artworkController.createArtwork);

router.route("/latest").get(artworkController.getAllArtworksLatest); // 최신 순 작품 조회

router.route("/likes").get(artworkController.getAllArtworksByLikes); // 좋아요 순 작품 조회

router.route("/views").get(artworkController.getAllArtworksByViews); // 조회수 순 작품 조회

router.route("/last-month").get(artworkController.getArtworksFromLastMonth); // 한 달 이내 작품 조회

router
    .route("/following")
    .get(authMiddleware.protect, artworkController.getFollowingArtworks); // 팔로잉 사용자 작품 조회

router
    .route("/:id")
    .get(artworkController.getArtworkById)
    .patch(authMiddleware.protect, artworkController.updateArtwork)
    .delete(authMiddleware.protect, artworkController.deleteArtwork);

router
    .route("/:id/comment")
    .get(artworkController.getComments)
    .post(authMiddleware.protect, artworkController.addComment);

router
    .route("/:artworkId/comment/:commentId")
    .delete(authMiddleware.protect, artworkController.deleteComment);

router
    .route("/:id/like")
    .post(authMiddleware.protect, artworkController.toggleLike);

router.route("/user/:userId").get(artworkController.getArtworksByUser);

module.exports = router;
