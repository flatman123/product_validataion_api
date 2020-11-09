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

    productInfo = {};
    productInfo.user = req.appUser.id;

    if (asin) productInfo.asin = asin;
    if (productName) productInfo.productInfo = productInfo;
    if (link) productInfo.link = link;
    if (quantity) productInfo.quantity = quantity;
    if (functionality) productInfo.functionality = functionality;
    if (quality) productInfo.quality = quality;
    if (aesthetic) productInfo.aesthetic = aesthetic;


    try {
        // Get user product Via Id
        let userProducts = await ProductInfo
            .findOne({ user: req.params.userID })
            .populate('user', 'name');
        
        if (userProducts) {
            await ProductInfo.findByIdAndUpdate(
                { user: req.appUser.id },
                { $set: productInfo },
                { new: true }
            );
        };

        await ProductInfo.save(productInfo);
        res.json(productInfo);


    } catch(err) {
        console.error(err);
        res.status(500).send('Server Error');
    };
});

module.exports = router;
