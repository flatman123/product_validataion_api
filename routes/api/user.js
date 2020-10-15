const express = require('express');
const router = express.Router();
const User = require('../../models/Users');
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcyrpt = require('bcrypt');
const jwtSecret = require('config').get('jwtSecret');
const jwt = require('jsonwebtoken');


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

        user = new User({
            name,
            email,
            avatar,
            password,
        });
        
            // Create user Avatar
        const avatar = gravatar.url(
            email,
            {
                s: '200',
                r: 'pg',
                d: 'robohash'
            });

            // encrypt user password before creation of user in database

        const saltRounds = 10;
        salt = await bcyrpt.genSalt(saltRounds);
        user.password = await bcyrpt.hash(password, salt);

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
            { expiresIn: '1h' });




            // Push new user to database
        await user.save();

            


            
        
    } catch (err) {
        //User doesn't exist error
        console.error(err.message);
        res.status(500).send([{ msg: 'Server Error'}]);
    };


    // Profile Avatar


    // Return_Json    

});

module.exports = router;