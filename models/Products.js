const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productInfoSchema = new mongoose.Schema({
    asin: String,
    productName: String,
    link: String,
    quantity: String,
    functionality: String,
    quality: String,
    aesthetic: String
});

const ProductInfo = mongoose.model('productInfos', productInfoSchema);

module.exports = ProductInfo;
