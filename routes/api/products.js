const ProductInfo = require('../models/productInfoModel');


module.exports = function(app) {
    app.get('/', function(req, res){
        ProductInfo.find({});
    });

    app.post('/product', function(req, res){
        // POST CODE
    });

    app.delete('/product', function(req, res){
        //DELETE CODE
    });
};