const authMiddleware = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "로그인이 필요합니다." });
    }
    next();
};

module.exports = authMiddleware;

exports.isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        // 로그인된 상태라면 profile.html로 리다이렉트
        return res.redirect("/profile");
    }
    next();
};
