const { User } = require('../database/db');
const bcrypt = require('bcryptjs');

async function loginPost(req, res) {
    const { username, password } = req.body;

    // Check for user existing
    const user = await User.findOne({ username });

    if (!user) {
        return res.render('login', { user: null, error: 'User not found!' });
    }

    // Check for password match
    const match = await bcrypt.compare(password, user.hashed_password);

    if (!match) {
        return res.render('login', { user: null, error: 'Username or password is incorrect!' });
    }

    // Add user id to session
    req.session.userId = user._id;

    return res.status(303).redirect('/');
}

module.exports = { loginPost };
