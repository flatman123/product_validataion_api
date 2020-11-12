const Products = require('../../models/Products');
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const { json } = express.json();

// GET /api/product-info/
// @desc Get user products via id
// @Accecs Private
router.post('/user/:userID', [auth,
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
        let listOfProducts = await Products
                .findOne({ user: req.params.userID })
        
             // Update Products
        if (listOfProducts) {
            await Products.findByIdAndUpdate(
                { user: req.appUser.id },
                { $set: { userProducts: userProducts.push(productInfo) } },
                { new: true }
            );
        };

        listOfProducts = new Products(productInfo);    
    
        await listOfProducts.save();
        res.json(listOfProducts);
        
    } catch(err) {
        if (err.kind == 'ObjectId') {
            console.error(err.message);
            return res.status(500).send('Server Error');
        };
    };
});

module.exports = router;
