const mongoose = require('mongoose');

const promoterSchema = new mongoose.Schema({
    Name: {
        type: String,
        trim: true
    },
    userName: {
        type: String,
        index: true
    },
    Email: {
        type: String,
        unique: true,
        lowercase: true,
        sparse: true,
        trim: true,
        index: true
    },
    mobileNumber: {
        type: String,
        trim: true,
        index: {
            unique: true
        }
    },
    Address: {
        type: String,
        trim: true,
        required: true
    },
    Password: {
        type: String,
        trim: true,
        required: true
    },
    BankName:{
        type: String,
        trim: true,
    },
    AccountNo:{
        type: String,
        trim: true,
    },
    IFSCCode:{
        type: String,
        trim: true,
    },
    isBlocked: {
        type: Boolean,
        default: false,
        index: true
    }
}, { timestamps: true });

const promoterModel = mongoose.model('Promoters', promoterSchema);
module.exports = { promoterModel };






