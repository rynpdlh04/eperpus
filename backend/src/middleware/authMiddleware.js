const jwt = require("jsonwebtoken");

function authMiddleware(req,res,next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Akses ditolak, Silakan login."
            });
        }

        // Format:
        // Bearer TOKEN
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Token tidak ditemukan"
            });
        }

        // verif token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // simpan data user ke request
        req.user = decoded;

        // lanjut ke endpoint
        next();
    } catch(error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Sesi login telah berakhir. Silakan login kembali."
            });
        }

        if (error.name !== "JsonWebTokenError" && error.name !== "NotBeforeError") {
            console.error(error);
        }

        return res.status(401).json({
            message: "Token tidak valid atau sudah expired"
        });
    }
}

module.exports = authMiddleware;