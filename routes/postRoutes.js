const express = require("express");
const multer = require("multer");
const router = express.Router();
const postController = require("../controllers/postController");
const authMiddleware = require("../middlewares/authMiddleware");

const upload = multer({ dest: "uploads/" });

router.post(
    "/upload",
    authMiddleware,
    upload.single("image"),
    postController.createPost
);
router.get("/feed", authMiddleware, postController.getFeed);
router.get("/my", authMiddleware, postController.getMyPosts); // 로그인한 사용자의 게시물만 반환

module.exports = router;
