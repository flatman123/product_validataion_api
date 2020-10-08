const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    products: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = User = mongoose.model('amzuser', UserSchema);