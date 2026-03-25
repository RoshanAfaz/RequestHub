const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        const token = authHeader.replace("Bearer ", "");
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add user from payload
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

module.exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Access denied: Admin only" });
    }
};
