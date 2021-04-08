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
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    pincode: {
        type: Number,
    },
    address_line1: {
        type: String,
        trim: true
    },
    address_line2: {
        type: String,
        trim: true
    }
});

const taxDetailSchema = new Schema({
    _id: false,
    state: {
        type: String,
        trim: true
    },
    seller_name: {
        type: String,
        trim: true
    },
    GST_number: {
        type: String,
        trim: true
    },
    PAN_number: {
        type: String,
        trim: true
    }
});

const bankAccountSchema = new Schema({
    _id: false,
    account_holder_name: {
        type: String,
        trim: true
    },
    account_type: {
        type: String,
        enum: ['Savings Account', 'Current Account']
    },
    account_number: {
        type: String,
        trim: true
    },
    IFSC_code: {
        type: String,
        trim: true
    }
});

const VendorDetailSchema = new Schema({
    vendor_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        index: true,
        ref: 'user_registers'
    },
    status_list: statusSchema,
    company_name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    company_address: companyAddressSchema,
    store_name: {
        type: String,
        lowercase: true,
        unique: true,
        sparse: true,
        trim: true
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
        type: String,
        trim: true
    },
    signature_url: {
        type: String
    },
    is_admin_approved: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });





const vendorDetailsModel = mongoose.model('vendor_details', VendorDetailSchema);
module.exports = { vendorDetailsModel };


