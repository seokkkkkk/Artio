const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
    try {
        let token;
        if (req.cookies && req.cookies.jwt) {
            token = req.cookies.jwt;
        } else if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                status: "fail",
                message: "인증되지 않은 사용자입니다.",
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({
                status: "fail",
                message:
                    error.name === "TokenExpiredError"
                        ? "토큰이 만료되었습니다."
                        : "유효하지 않은 토큰입니다.",
            });
        }

        req.user = await User.findById(decoded.id);
        if (!req.user) {
            return res.status(401).json({
                status: "fail",
                message: "유효하지 않은 사용자입니다.",
            });
        }

        next();
    } catch (error) {
        res.status(401).json({ status: "fail", message: "인증 오류" });
    }
};

exports.redirectIfLoggedIn = (req, res, next) => {
    if (req.user) {
        return res.redirect("/"); // 홈 페이지로 리디렉션
    }
    next();
};

exports.redirectIfNotLoggedIn = (req, res, next) => {
    if (!req.user) {
        return res.redirect("/login"); // 로그인 페이지로 리디렉션
    }
    next();
};
