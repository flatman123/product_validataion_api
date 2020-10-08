const express = require('express');
const router = express.Router();
const User = require('../../models/Users');
const { check, validationResult } = require('express-validator');
var gravatar = require('gravatar');



router.post('/api/user', [
    // Check User Input
    check('email', 'A valid email address is required').isEmail(),
    check('name', 'Missing contents in name field!').not().isEmpty(),
    check('password', 'Invalid password, please try again!').isLength({ min: 6 })
],
async (req, res) => {
    // Validation (i.e email, name, password)
    const errors = validationResult(req);
   
    if (!errors.isEmpty()) {
            res.status(401).json([{ errors: errors.array() }]);
        };

    const { name, email, password } = req.body

    try{
        //Check Database for user
        const user = await User.findOne(email);

        //CREATE USER
        if (user){
            console.log('user exists');
        }

            // Create user Avatar


            // encrypt user password before creation


            // return token to user for protected route
        
    } catch(err) {
        //User doesn't exist error
        res.status(500).json([{ msg: 'Server Error'}])
    };


    // Profile Avatar


    // Return_Json    

});

module.exports = router;