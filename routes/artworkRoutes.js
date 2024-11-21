const express = require("express");
const artworkController = require("../controllers/artworkController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router
    .route("/")
    .get(artworkController.getAllArtworks)
    .post(authMiddleware.protect, artworkController.createArtwork);

router
    .route("/:id")
    .get(artworkController.getArtworkById)
    .patch(authMiddleware.protect, artworkController.updateArtwork)
    .delete(authMiddleware.protect, artworkController.deleteArtwork);

router
    .route("/:id/comment")
    .post(authMiddleware.protect, artworkController.addComment);

router
    .route("/:artworkId/comment/:commentId")
    .delete(authMiddleware.protect, artworkController.deleteComment);

router
    .route("/:id/like")
    .post(authMiddleware.protect, artworkController.toggleLike);

module.exports = router;
