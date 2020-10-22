const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/Users');


// @Route /api/profile/me
// desc Get User profile POST login.
// @Access Private

router.get('/me', auth, async (req, res) => {

    try {
        //locate User Profile by ID; in database
        const profile = await User.findOne(req.body.id);

        !profile ? res.status(400).json( {msg: 'That user does not exist' }) : null

    } catch(err) {
        console.error(err.messages);
        res.status(500).send('Server Error');
    }
});

module.exports = router;