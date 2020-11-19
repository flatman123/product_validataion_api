const Products = require('../../models/Products');
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const { json } = express.json();

// PUT /api/product-info/
// @desc Get user products via id
// @Accecs Private
router.put('/user/:userID', [auth,
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
        const productID = req.body._id;

        let listOfProducts = await Products
                .findOne({ user: req.params.userID });
        
        if ( listOfProducts ) {
            const product = listOfProducts.userProducts.find(item => item['_id'] == productID);
            
            // UPDATED EXISTING PRODUCT
            if ( product ) {
                const productIndex = listOfProducts.userProducts.indexOf(product);                
                listOfProducts.userProducts[productIndex] = productInfo;

                await Products.findOneAndUpdate(
                    { user: req.appUser.id },
                    { $set: listOfProducts },
                    { new: true }
                );
                return res.send('Product Updated!');
            };

            // ADD ADDITIONAL PRODUCT TO USER PRODUCT LIST
            listOfProducts.userProducts.unshift(productInfo);
            await Products.findOneAndUpdate(
                { user: req.appUser.id },
                { $set: listOfProducts },
                { new: true }
            );            
            return res.send('Product added to list!');
        };

        // ADDING FIRST PRODUCT TO THE LIST
        listOfProducts = new Products(productInfo);
        listOfProducts.userProducts.unshift(productInfo);
        await listOfProducts.save();
        res.json(listOfProducts);
        
    } catch(err) {
        if (err.kind == 'ObjectId') {
            console.error(err.message);
            return res.status(500).send('Server Error');
        };
    };
});

// DELETE /products/user/:userID
// Delete a single product from user product list.
// @Access Private
router.delete('/user/myproducts/:userID', auth, async (req, res) => {
    const productID = req.body._id;
    try {
        const listOfProducts = await Products.findOne({ user: req.params.userID });
        let product = listOfProducts.userProducts.find(item => item['_id'] == productID);

        // UPDATE EXISTING PRODUCT
        if ( product !== undefined ) {
            const productIndex = listOfProducts.userProducts.indexOf(product);
            product = listOfProducts.userProducts[productIndex];
            
            await Products.updateOne(
                {},
                { $pull: { userProducts: product } },
                { multi: true }
            );
            return res.send('Product deleted from list!');
        };
        return res.status(400).send('Server Error');

    } catch(err) {

        console.error(err.message);
        res.status(500).send('Server Error');
    };
});


// DELETE api/products/user/purgeproducts/:userID
// Purge all products within user list
// @Access Private
router.delete('/user/purgeproducts/:userID', auth, async (req, res) => {
    try {
        const listOfProducts = await Products.findOne({ user: req.params.userID });
        console.log(listOfProducts);

        if (!listOfProducts) {
            return res.status(400).json({ msg: 'Server Error' });
        };

        // await Products.findOneAndDelete({userProducts: listOfProducts.userProducts})
        return res.send('All products were deleted!');


    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET /user/products/:userID
// Get list of user products
// @access private
router.get('/user/myproducts/:userID', auth, async(req, res) => {
    try{
        const listOfProducts = await Products.findOne({ user: req.params.userID }).populate('user', ['name', 'avatar']);
        if ( listOfProducts.userProducts.length === 0 ) {
            return res.status(400).send('Hmm, We\'re not seeing any products listed!');
        };
        return res.json(listOfProducts);

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    };
});


module.exports = router;
