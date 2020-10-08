const express = require('express');
const router = express.Router();


// GET /api/profile
//
router.get('/api/profile', (req, res) => {

    // test
    res.send('Proile Router');
});

module.exports = router;