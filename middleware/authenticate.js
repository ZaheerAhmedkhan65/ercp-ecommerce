const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticate(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).redirect('/auth/signin');
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).redirect('/auth/signin');
        }
        req.user = decoded;
        next();
    });
}

module.exports = authenticate;