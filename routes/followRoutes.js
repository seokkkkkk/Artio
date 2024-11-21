const express = require("express");
const followController = require("../controllers/followController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/follow/:id", authMiddleware.protect, followController.followUser);
router.post(
    "/unfollow/:id",
    authMiddleware.protect,
    followController.unfollowUser
);

module.exports = router;
