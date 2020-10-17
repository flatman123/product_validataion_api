const jwt = require('jsonwebtoken');
const { json } = require('express');
const tokenSecret = require('config').get('jwtSecret');

module.exports = function(req, res, next) {
    // Get the token
    const token = req.header('x-auth-token');

    // Logic for no token
    if (!token) {
        return res.status(401, 'No token. Authorization denied.');
    };

    // Verify token
    try {
        const decodeToken = jwt.verify(token, tokenSecret);

        // Attach decoded payload to user's request
        req.appUser = decodeToken.appUser;
        next();

    } catch(err) {
        res.status(401).json({ msg: 'Token is not valid' });
    };
};