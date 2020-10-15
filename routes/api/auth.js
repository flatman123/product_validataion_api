const express = require('express');
const user = require('../../models/Users');
const router = express.Router();
const auth = require('../../middleware/auth');
const mongoose = require('mongoose');

// GET @Route /api/auth

router.get('/', auth, async function(req, res, next) {
    // Code for succesful token authentication        
    try {
        // Fetch User from database
        const userData = await user.findById(req.appUser.id);
        res.json(userData);

    } catch(err) {
        // console.error(err.messages)
        res.status(500).send('Server Error');
    };
});

module.exports = router;