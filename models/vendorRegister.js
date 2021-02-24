const mongoose = require('mongoose');


const VendorRegisterSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    mobile_number: {
        country_code: {
            type: String,
            required: true
        },
        number: {
            type: String,
            required: true
        }
    },
    email: {
        type: String,
        unique: true,
        lowecase: true,
        trim: true,
        required: true
    },
    hash: {
        type: String,
        required: true
    }
}, { timestamps: true });





const vendorRegisterModel = mongoose.model('vendor_registers', VendorRegisterSchema);
module.exports = { vendorRegisterModel };






