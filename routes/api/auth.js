const express = require('express');
const User = require('../../models/Users');
const router = express.Router();
const auth = require('../../middleware/auth');
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const jwtSecret = require('config').get('jwtSecret');
const { findOne } = require('../../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// GET @Route /api/auth
// desc  Authenticat user information and return user Data without pwd.
// Access Public

router.get('/', auth, async function(req, res) {
    // Code for succesfull token authentication        
    try {
        // Fetch User from database
        const userData = await User
            .findById(req.appUser.id) // <-- this was setup in the 'auth' middleware
            .select('-password');
        res.json(userData);
    } catch(err) {
        // console.error(err.messages)
        res.status(500).send('Server Error');
    };
});



// @Route /api/auth
// Desc User Login
// Access Public

router.post('/', [
    // Check for email
    check('email', 'A Valid Email Address Is Required')
        .isEmail(),
    check('password', 'A password Is Required')
        .exists()
], async(req, res) => {
    // Check for email in database
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try{
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json([{ msg: 'Invalid Credentials' }]);
        };
     
        const correctPassword = await bcrypt.compare(password, user.password);
        
        if (!correctPassword) {
            return res.status(400).json([{ msg: 'Invalid Credentials' }]);
        };

        const jwtPayload = {
            appUser: {
                id: user.id
            }
        };

        const jwtToken = jwt.sign(
            jwtPayload,
            jwtSecret,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                return res.json({ token });
            });

    }catch(err) {
        res.status(400).json([{ msg: 'Invalid Credentials' }]);
    }
});

module.exports = router;