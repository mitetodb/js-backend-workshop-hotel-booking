const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { TOKEN_SECRET, COOKIE_NAME } = require('../config');
const userService = require('../services/user');

module.exports = () => (req, res, next) => {
    // TODO parse jwt
    // attach functions to context
    req.auth = {
        async register(username, password) {
            const token = await register(username, password);
            res.cookie(COOKIE_NAME, token);
        },
        async login(username, password) {
            const token = await login(username, password);
            res.cookie(COOKIE_NAME, token);
        },
        logout() {
            res.clearCookie(COOKIE_NAME);
        }
    };

    next();
};

async function register(username, password) {
    // TODO adapt properties to project requirements
    // TODO extra validations
    const existing = await userService.getUserByUsername(username);

    if (existing) {
        throw new Error('Username is taken!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userService.createUser(username, hashedPassword);

    return generateToken(user);
}

async function login(username, password) {
    const user = await userService.getUserByUsername(username);

    if(!user) {
        throw new Error('Wrong username or password!');
    }

    const hasMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!hasMatch) {
        throw new Error('Wrong username or password!');
    }

    return generateToken(user);
}

function generateToken(userData) {
    return jwt.sign({
        _id: userData._id,
        username: userData.username
    }, TOKEN_SECRET);
}