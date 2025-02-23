const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
    try {
        console.log("Auth Headers:", req.headers);
        const authHeader = req.header("Authorization");
        
        if (!authHeader) {
            console.log("No auth header found");
            return res.status(401).json({ message: "No authorization header" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            console.log("No token in auth header");
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);
        
        req.user = decoded;  // This will contain {userId, email}
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        res.status(401).json({ message: "Invalid token", error: error.message });
    }
};