const { User } = require('../database/db');

async function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
}

async function ensureNotAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        res.redirect('/');
    } else {
        next();
    }
}

async function ensureIsAdmin(req, res, next) {
    if (req.session && req.session.userId) {
        try {
            const user = await User.findById(req.session.userId);

            if (user && user.admin) {
                next();
            } else {
                res.redirect('/');
            }
        } catch (error) {
            console.error("Error checking admin status:", error);
            res.redirect('/');
        }
    } else {
        res.redirect('/login');
    }
}

module.exports = {
    ensureAuthenticated,
    ensureNotAuthenticated,
    ensureIsAdmin
}
