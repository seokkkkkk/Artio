// middlewares/uploadMiddleware.js
const multer = require("multer");
const path = require("path");

// 파일 저장 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, "../uploads/profile_images"));
    },
    filename: (req, file, cb) => {
        cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`);
    },
});

// 파일 필터 설정 (png, jpg, jpeg만 허용)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "지원되지 않는 파일 형식입니다. PNG, JPG, JPEG 파일만 업로드 가능합니다."
            ),
            false
        );
    }
};

// 파일 업로드 미들웨어 설정
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }, // 최대 파일 크기 5MB
});

module.exports = upload;
