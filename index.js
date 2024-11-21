require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/dbConnect");
const helmet = require("helmet");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB 연결 설정
dbConnect();

// 미들웨어 설정
app.use(helmet()); // 보안 미들웨어 추가
app.use(cors()); // CORS 설정 추가
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); // 쿠키 파서 추가
app.use("/uploads", express.static("uploads")); // 정적 파일 제공

// 라우트 설정
const userRoutes = require("./routes/userRoutes");
const artworkRoutes = require("./routes/artworkRoutes");
const followRoutes = require("./routes/followRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/api/users", userRoutes);
app.use("/api/artworks", artworkRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/auth", authRoutes);

// 전역 에러 핸들러 추가
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: "fail",
        message: "서버 오류가 발생했습니다.",
    });
});

// 서버 시작
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
