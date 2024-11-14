const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/users", authMiddleware, userController.getUsers);
router.get("/user/profile", authMiddleware, userController.getProfile);
router.put("/user/:id", authMiddleware, userController.updateUserProfile);
router.delete("/withdraw", authMiddleware, userController.deleteUser);

module.exports = router;
