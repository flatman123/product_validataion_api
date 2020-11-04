const ProductInfo = require('../models/productInfoModel');
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const { json } = express.json();




// GET /api/product-info/
// @desc Get user products via id
// @Accecs Private
router.get('/my-product/:userID', [auth,
    check('asin', 'Product asin is required')
        .not()
        .isEmpty(),
    check('productName', 'A product name is required')
], async(req, res) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        res.status(400).json({ error: error});
    };

    try {
        // Get user product Via Id


    } catch(err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
