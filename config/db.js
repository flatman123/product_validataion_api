const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongodb');

const connectDB = async () => {
    try {
        await mongoose.connect(db,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('DATABASE CONNECTED!')

    } catch(err) {
        console.log(err);
        process.exit(1);
    };
};

module.exports = connectDB ;