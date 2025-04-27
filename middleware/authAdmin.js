

function authAdmin(req, res, next) {
    const user = req.user;
    if (!user) {
        return res.status(401).redirect('/auth/signin');
    }
    if (user.role !== "admin") {
        return res.status(401).redirect('/');
    }
    next();
}

module.exports = authAdmin;