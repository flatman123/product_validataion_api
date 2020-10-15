const express = require('express');
const user = require('../../routes/api/user');
const router = express.Router();
const auth = require('../../middleware/auth');

// GET @Route /api/auth

router.get('/', auth, async function(req, res, next) {
    // Code for succesful token authentication
});