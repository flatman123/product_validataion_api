const express = require('express');
const router = express.Router();
const { json } = express.json();
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
        return res.status(400).json({ msg: 'Amazon seller type must be FBA or FBM' });
    };

    //Build profile object

    const profileFields = {
       companyName,
       comapanyAddress,
       companyWebsite,
       location,
       amazonSellerType,
       bio,
       facebook,
       youtube,
       instagram,
       twitter,
       linkedin
    } = req.body

    const profileObject = {};
    
    if (companyName) profileObject.companyName = companyName;
    if (comapanyAddress) profileObject.comapanyAddress = comapanyAddress;
    if (location) profileObject.location = location;
    if (companyWebsite) profileObject.companyWebsite = companyWebsite;
    if (amazonSellerType) profileObject.amazonSellerType = amazonSellerType;
    if (bio) profileObject.bio = bio;
    profileObject.user = req.appUser.id;

    // Build Social Object
    profileObject.social = {};
    if (twitter) profileObject.social.twitter = twitter;
    if (youtube) profileObject.social.youtube = youtube;
    if (facebook) profileObject.social.facebook = facebook;
    if (linkedin) profileObject.social.linkedin = linkedin;
    if (instagram) profileObject.social.instagram = instagram;

    try {
        let userProfile = await Profile.findOne({ user: req.appUser.id });
        
        // Update Profile
        if (userProfile) {
            await Profile.findByIdAndUpdate(
                { user: req.appUser.id },
                { $set: profileObject },
                { new : true }
            );
        };

        // Create Profile
        const profile = new Profile(profileObject);
        await profile.save();
        res.json(profile);

    } catch(err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    };
});


// GET /api/profile/
// desc Get all profiles
// @Access Public

router.get('/', async (req, res) => {
    try {
        
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' })
    }
})

module.exports = router;