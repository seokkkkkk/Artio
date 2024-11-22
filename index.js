require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/dbConnect");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
const ejsLayouts = require("express-ejs-layouts");
const authMiddleware = require("./middlewares/authMiddleware");

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB 연결 설정
dbConnect();

// 미들웨어 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); // 쿠키 파서 추가
app.use("/uploads", express.static("uploads")); // 정적 파일 제공

// EJS 설정
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 정적 파일 제공 (CSS 등)
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    res.locals.currentPath = req.path; // 현재 요청 경로를 `currentPath`로 설정
    next();
});

app.get("/login", authMiddleware.redirectIfLoggedIn, (req, res) => {
    res.render("pages/login");
});

app.get("/signup", authMiddleware.redirectIfLoggedIn, (req, res) => {
    res.render("pages/register");
});

// express-ejs-layouts 미들웨어 추가
app.use(ejsLayouts);
app.set("layout", "layout"); // 기본 레이아웃 파일 설정 (layout.ejs)

// 라우트 설정
app.get("/", authMiddleware.protect, (req, res) => {
    res.render("pages/home", {
        cssFile: "home",
    });
});

app.get("/profile", authMiddleware.protect, (req, res) => {
    res.render("pages/profile", {
        cssFile: "profile",
    });
});

app.get("/profile/:id", authMiddleware.protect, (req, res) => {
    res.render("pages/profileUser", {
        cssFile: "profile",
    });
});

app.get("/follow", authMiddleware.protect, (req, res) => {
    res.render("pages/follow", {
        cssFile: "follow",
    });
});

app.get("/post/new", authMiddleware.protect, (req, res) => {
    res.render("pages/newPost", {
        cssFile: "newPost",
    });
});

app.get("/post/:id", authMiddleware.protect, (req, res) => {
    res.render("pages/postDetail", {
        cssFile: "postDetail",
    });
});

app.use(helmet()); // 보안 미들웨어 추가
app.use(cors()); // CORS 설정 추가

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

app.get("/artworks/:id", async (req, res) => {
    try {
        const artwork = await Artwork.findById(req.params.id)
            .populate("createdBy", "username profileImage")
            .populate("comments.user", "username profileImage");
        if (!artwork) {
            return res.status(404).send("작품을 찾을 수 없습니다.");
        }
        res.render("artworkDetail", { artwork });
    } catch (err) {
        console.error(err);
        res.status(500).send("서버 오류가 발생했습니다.");
    }
});

// 서버 시작
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
