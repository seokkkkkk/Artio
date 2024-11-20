require("dotenv").config(); // .env 파일 로드
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const dbConnect = require("./config/dbConnect");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// 템플릿 엔진 설정
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // 뷰 파일 경로 설정

// MongoDB 연결
dbConnect();

// 세션 설정
app.use(
    session({
        secret: process.env.SESSION_SECRET || "defaultSecret",
        resave: false,
        saveUninitialized: true,
    })
);

// Body parser 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 정적 파일 및 업로드 폴더 제공
app.use(express.static("views")); // HTML 파일 제공
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // 이미지 업로드 파일 제공

// 기본 라우트 설정
app.get("/", (req, res) => {
    if (req.session.user) {
        return res.redirect("/profile");
    }
    res.sendFile(path.join(__dirname, "views/login.html"));
});

app.get("/login", (req, res) => {
    if (req.session.user) {
        res.redirect("/profile");
    }
    res.sendFile(path.join(__dirname, "views/login.html"));
});

// 프로필 페이지 라우트
app.get("/profile", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    res.sendFile(path.join(__dirname, "views/profile.html"));
});

// 마이페이지 라우트
app.get("/mypage", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    res.sendFile(path.join(__dirname, "views/mypage.html"));
});

// 피드 라우트
app.get("/feed", (req, res) => {
    res.sendFile(path.join(__dirname, "views/feed.html"));
});

// API 라우트 연결
app.use("/api", userRoutes);

// 게시물 관련 라우트 연결
app.use("/posts", postRoutes);

// 서버 시작
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
