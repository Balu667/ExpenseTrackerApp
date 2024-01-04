const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    try {
        let token, authHeader;
        authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer")) {
            token = authHeader.split(" ")[1];
            jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
                if (err) {
                    return res.send({ status: 0, response: "User not authorized" });
                } 
                next();
            });
        } else {

            return res.send({ status: 0, response: "Token not provided" });
        }
    } catch (error) {
        return res.send({ status: 0, response: error.message });
    }
};

module.exports = { verifyToken }
