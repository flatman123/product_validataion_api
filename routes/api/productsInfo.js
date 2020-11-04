const ProductInfo = require('../models/productInfoModel');
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');



// GET /api/product-info/
// @desc Get user products via id
// @Accecs Private
router.get('/my-product', [auth,
    check('asin')
        .not()
        .isEmpty()
], async(req, res) => {

});
