const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/Users');


// @Route /api/profile/me
// desc Get User profile POST login.
// @Access Private

router.get('/me', auth, async (req, res) => {

    try {
        //locate User Profile by ID within the in database
        const profile = await Profile.findOne( { userPro: req.body.id }).populate('user',
            ['name', 'avatar']);

        !profile ? res.status(400).json( { msg: 'There is no profile for that user in the database.' }) : null;
        

    } catch(err) {
        console.error(err.messages);
        res.status(500).send('Server Error');
    }
});

module.exports = router;