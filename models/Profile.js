const mongoose = require('mongoose');
const express = require('express');
const Schema = mongoose.Schema;

const ProfileSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'appuser' // pulling in information from the Users model
    },
    companyName: {
        type: String
    },
    companyAddress: {
        type: String        
    },
    companyWebsite: {
        type: String
    },
    location: {
        type: String
    },
    amazonSellerType: {
        type: String,
        required: true,
        uppercase: true
    },
    bio: {
        type: String
    },
    social: {
        facebook : {
            type: String
        },
        youtube: {
            type: String
        },
        instagram: {
            type: String
        },
        linkedin: {
            type: String
        },
        twitter: {
            type: String
        }
    },
    date : {
        type: Date,
        default: Date.now
    }    
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);