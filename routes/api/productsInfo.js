const ProductInfo = require('../models/productInfoModel');
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const { json } = express.json();




// GET /api/product-info/
// @desc Get user products via id
// @Accecs Private
router.get('/my-products/:userID', [auth,
    check('asin', 'Product asin is required')
        .not()
        .isEmpty(),
    check('productName', 'A product name is required')
        .not()
        .isEmpty()
], async(req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        res.status(400).json({ error: error});
    };

    try {
        // Get user product Via Id
        const userProducts = await ProductInfo
                                        .find({})
                                        .populate('user', ['name','avatar']);
        if (!userProducts) {
            return res.status(400).send('You currently have no products on your list');

        }

    } catch(err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
