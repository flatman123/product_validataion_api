const ProductInfo = require('../models/Products');
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const { json } = express.json();

// GET /api/product-info/
// @desc Get user products via id
// @Accecs Private
router.get('/:userID', [auth,
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

    // Build product Object
    const {
        asin,
        productName,
        link,
        quantity,
        functionality,
        quality,
        aesthetic
    } = req.body;

    const productInfo = {};
    productInfo.user = req.appUser.id;

    if (asin) productInfo.asin = asin;
    if (productName) productInfo.productName = productName;
    if (link) productInfo.link = link;
    if (quantity) productInfo.quantity = quantity;
    if (functionality) productInfo.functionality = functionality;
    if (quality) productInfo.quality = quality;
    if (aesthetic) productInfo.aesthetic = aesthetic;


    try {
        // Get user product Via Id
        let userProducts = await Products
                .findOne({ user: req.params.userID })
                .populate('user', 'name');
        

            // Update Products
        if (userProducts) {
            await Products.findByIdAndUpdate(
                { user: req.appUser.id },
                { $set: userProducts.unshift(productInfo) },
                { new: true }
            );
        };

        await Products.save(productInfo);
        res.json(productInfo);
        
    } catch(err) {
        console.error(err);
        res.status(500).send('Server Error');
    };
});

module.exports = router;
