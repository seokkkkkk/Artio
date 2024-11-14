require("dotenv").config(); // .env 파일 로드
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const dbConnect = require("./config/dbConnect");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("views")); // 정적 파일 제공

// 기본 라우트 설정
app.get("/", (req, res) => {
    if (req.session.user) {
        return res.redirect("/profile");
    }
    res.sendFile(__dirname + "/views/login.html");
});

// 프로필 페이지
app.get("/profile", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    res.sendFile(__dirname + "/views/profile.html");
});

// API 라우트 연결
app.use("/api", userRoutes);

// 서버 시작
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
