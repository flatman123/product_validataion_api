const ProductInfo = require('../../models/Products');

module.exports = function(app){
    //Testing the databse.
    
    const testData = {
        asin: 'NDKJFD89284N42',
        productName: 'PRODUCTNAME123',
        link: 'HTTPS:www.testWEbsite.com',
        quantity: 'The quantity is  ok I guess',
        functionality: 'functionality needs to be better',
        quality: 'The qualityc id decent.',
        aesthetic: 'Make is orange and blue'
    }
    //middleWare
    app.get('/seedDatabase', function(req, res){
        ProductInfo.create(testData, function(err, results){
            if (err) throw err;
            res.send(results);
        });
    });
};
