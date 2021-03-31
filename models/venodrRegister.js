const mongoose = require('mongoose');


const VendorRegisterSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true,
        index: true
    },
    hash: {
        type: String,
        required: true
    },
    is_blocked: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });





const vendorRegisterModel = mongoose.model('vendor_registers', VendorRegisterSchema);
module.exports = { vendorRegisterModel };


