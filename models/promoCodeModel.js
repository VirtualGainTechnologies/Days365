const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
    promoterName: {
        type: String,
        trim: true,
        index: true
    },
    promoterId: {
        type: String,
        trim: true
    },
    sellerName: {
        type: String,
        trim: true,
        index: true
    },
    sellerId: {
        type: String,
        trim: true
    },
    brandName: {
        type: String,
        trim: true,
    },

    percentageOnBrand: {
        type: String,
        trim: true,
        default:0
    },

    promoCode: {
        type: String,
        trim: true,
        unique: true,
        index:true,
       
    },
    isActive: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const promoCodeModel = mongoose.model('promoCode', promoCodeSchema);
module.exports = { promoCodeModel };






