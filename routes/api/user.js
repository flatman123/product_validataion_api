const express = require('express');
const router = express.Router();
const User = require('../../models/Users');
const { check, validationResult } = require('express-validator');
var gravatar = require('gravatar');



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
        const avatar = gravatar.url(
            email,
            {
                s: '200',
                r: 'pg',
                d: 'robohash'
            });

            // encrypt user password before creation of user in database
            user = new User({
                name,
                email,
                avatar,
                password,
            });

            // Push new user to database
            await user.save();

            // return token to user for protected route
        
    } catch (err) {
        //User doesn't exist error
        console.error(err.message);
        res.status(500).send([{ msg: 'Server Error'}]);
    };


    // Profile Avatar


    // Return_Json    

});

module.exports = router;