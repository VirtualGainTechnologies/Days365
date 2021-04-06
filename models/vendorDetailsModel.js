const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const statusSchema = new Schema({
    is_mobile_verified: {
        type: Boolean,
        default: true,
        required: true
    },
    is_seller_details_collected: {
        type: Boolean,
        default: false,
        required: true
    },
    is_tax_details_collected: {
        type: Boolean,
        default: false,
        required: true
    },
    _id: false
});


const companyAddressSchema = new Schema({
    _id: false,
    country: {
        type: String,
        required: true,
        default: "India"
    },
    state: {
        type: String,
    },
    city: {
        type: String,
    },
    pincode: {
        type: Number,
    },
    address_line1: {
        type: String,
    },
    address_line2: {
        type: String,
    }
});


const VendorDetailSchema = new Schema({
    vendor_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'user_registers'
    },
    status_list: statusSchema,
    company_name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    company_address: companyAddressSchema,
    store_name: {
        type: String,
        lowercase: true,
        unique: true
    }
}, { timestamps: true });





const vendorDetailsModel = mongoose.model('vendor_details', VendorDetailSchema);
module.exports = { vendorDetailsModel };


