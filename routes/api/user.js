const express = require('express');
const router = express.Router();
const User = require('../../models/Users');
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const jwtSecret = require('config').get('jwtSecret');
const jwt = require('jsonwebtoken');


// POST /api/auth/user
// desc Get User information to create account
// @Access Public  

router.post('/', [
    // Check User Input
    check('email', 'A valid email address is required').isEmail(),
    check('name', 'Missing contents in name field!').not().isEmpty(),
    check('password', 'Invalid password, please try again!').isLength({ min: 6 })
],
async (req, res) => {
    // Validation (i.e email, name, password)
    const errors = validationResult(req);
   
    if (!errors.isEmpty()) {
            return res.status(400).json([{ errors: errors.array() }]);
        };

    const { name, email, password } = req.body;

    try {
        //Check Database for user
        let user = await User.findOne({email});

        if (user) {
            return res.status(400).json([
                { errors: 'That user already exists!' }
            ]);
        };
        
        // CREATING USER
                
            // Create user Avatar
        avatar = gravatar.url(
            email,
            {
                s: '200',
                r: 'pg',
                d: 'robohash'
            });


        user = new User({
            name,
            email,
            avatar,
            password,
        });

            // encrypt user password before creation of user in database

        const saltRounds = 10;
        salt = await bcrypt.genSalt(saltRounds);
        user.password = await bcrypt.hash(password, salt);
        
        // return token to user for protected route

            // Build Payload for token.
            // Essentially the token will equal
                // the user's id that in the database.
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


            // Push new user to database
        await user.save();

        
    } catch (err) {
        //User doesn't exist error
        console.error(err.message);
        res.status(500).send([{ msg: 'Server Error'}]);
    };
});

module.exports = router;