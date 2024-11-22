const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.route("/me").get(authMiddleware.protect, userController.getCurrentUser);

router
    .route("/:id")
    .get(authMiddleware.protect, userController.getUserById)
    .patch(
        authMiddleware.protect,
        upload.single("profileImage"),
        userController.updateUser
    );

router
    .route("/:userId/following")
    .get(authMiddleware.protect, userController.isFollowing);

module.exports = router;
