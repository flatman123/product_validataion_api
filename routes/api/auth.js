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
        const userData = await User.findById(req.appUser.id).select('-password');
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
        let userData = User.findOne({ email });
        
        if 

    }catch(err) {
        res.status(400).json([{ msg: 'Server Error' }]);
    }
});

module.exports = router;