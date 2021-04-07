const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const statusSchema = new Schema({
    _id: false,
    is_mobile_verified: {
        type: Boolean,
        required: true,
        default: true
    },
    is_seller_info_collected: {
        type: Boolean,
        required: true,
        default: false
    },
    is_tax_details_collected: {
        type: Boolean,
        required: true,
        default: false
    }
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

const taxDetailSchema = new Schema({
    _id: false,
    state: {
        type: String,
    },
    seller_name: {
        type: String,
    },
    GST_number: {
        type: String,
    },
    PAN_number: {
        type: String,
    }
});

const bankAccountSchema = new Schema({
    _id: false,
    account_holder_name: {
        type: String,
    },
    account_type: {
        type: String,
        enum: ['Savings Account', 'Current Account']
    },
    account_number: {
        type: String,
    },
    IFSC_code: {
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
    },
    shipping_method: {
        type: String,
        required: true,
        enum: ["Fulfillment by Days365"],
        default: "Fulfillment by Days365"
    },
    tax_details: taxDetailSchema,
    shipping_fee: {
        type: Number,
        required: true,
        default: 0
    },
    bank_account_details: bankAccountSchema,
    product_tax_code: {
        type: String
    },
    signature_url: {
        type: String
    }
}, { timestamps: true });





const vendorDetailsModel = mongoose.model('vendor_details', VendorDetailSchema);
module.exports = { vendorDetailsModel };


