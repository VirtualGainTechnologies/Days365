const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const statusSchema = new Schema({
    is_mobile_verified: {
        type: Boolean,
        default: false,
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





const VendorDetailSchema = new Schema({
    vendor_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    status_list: statusSchema

}, { timestamps: true });





const vendorDetailsModel = mongoose.model('vendor_details', VendorDetailSchema);
module.exports = { vendorDetailsModel };


