const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/Users');
const { check, validationResult } = require('express-validator');



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
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @Route /api/profile/
// desc Create and Update user profile
// @Access Private

router.post('/', [auth, [
    check('amazonSellerType')
        .isIn(['FBA', 'FBM'])
        .not()
        .isEmpty()        
]], async (req, res) => {
    // Code
    const error = validationResult(req);
    if (!error.isEmpty()){
        return res.status(400).json({ msg: 'Amazon seller type is required' });
    };

    // Check for profile
    


});

module.exports = router;