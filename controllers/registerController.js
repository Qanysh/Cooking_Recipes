const bcrypt = require('bcryptjs');
const { User } = require('../database/db');

async function registerPost(req, res) {
    const { username, password, re_password } = req.body;

    const userExists = await User.findOne({ username });

    if (password !== re_password) {
        return res.render('signup', { user: null, error: 'Passwords do not match!', success: null });
    }

    if (password.length < 8) {
        return res.render('signup', { user: null, error: 'Password must be at least 8 characters long!', success: null });
    }

    if (userExists) {
        return res.render('signup', { user: null, error: 'User already exists!', success: null });
    }

    const hashed_password = await bcrypt.hash(password, 10);

    let user = null;

    try {
        user = new User({ username, hashed_password });
    } catch (exception) {
        return res.render('signup', { user: null, error: `Error creating user!<br>${exception}`, success: null });
    }

    await user.save();

    return res.render('signup', { user: null, error: null, success: 'User created successfully!' });
}

module.exports = { registerPost };
