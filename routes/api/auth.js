const express = require('express');
const User = require('../../models/Users');
const router = express.Router();
const auth = require('../../middleware/auth');
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');


// GET @Route /api/auth
// desc  User Authentication
// Access Public

router.get('/', auth, async function(req, res) {
    // Code for succesfull token authentication        
    try {
        // Fetch User from database
        const userData = await User
            .findById(req.appUser.id)
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
], async function(req, res) {
    // Check for email in database
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    
    try{
        let user = User.findOne({ email });
        
        if (!user) {
            return res.status(400).json([{ msg: 'Invalid Credentials' }]);
        };
        const { email, password } = req.body;

        // Encrypt user's password
        const saltRounds = 10;
        salt = await bcrypt.genSalt(saltRounds);
        user.password = await bcrypt.hash(password, salt);
        

        // return token to user for protected route
            // Build Payload for token.
        const jwtPayload = {
            appUser: {
                id: user.id
            }
        };

        // Signed Token.
        const jwtToken = jwt.sign(
            jwtPayload,
            jwtSecret,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            });

    }catch(err) {
        res.status(400).json([{ msg: 'Invalid Credentials' }]);
    }
});

module.exports = router;