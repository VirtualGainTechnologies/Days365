const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const productVariantSchema = new Schema({
    color: {
        type: String,
        default: "N/A",
        required: true
    },
    size: {
        type: String,
        default: "N/A",
        required: true
    },
    UPC: {
        type: String
    },
    EAN: {
        type: String
    },
    ISBN: {
        type: String
    },
    days_product_code: {
        type: String,
        uppercase: true,
        index: {
            unique: true
        }
    },
    SKU_id: {
        type: String,
        required: true
    },
    ingredients: {
        type: String
    },
    how_to_use: {
        type: String
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    Offer_price: {
        type: Number,
        required: true
    },
    offer_description: {
        type: String
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    shipping_fee: {
        type: Number,
        required: true,
        default: 0
    },
    tax_code: {
        type: String,
        required: true,
        enum: ['A_GEN_EXEMPT', 'A_GEN_MINIMUM', 'A_GEN_SUPERREDUCED', 'A_GEN_REDUCED',
            'A_GEN_STANDARD', 'A_GEN_PEAK', 'A_GEN_PEAK_CESS12', 'A_GEN_PEAK_CESS60', 'A_GEN_JEWELLERY']
    },
    image_URLs: [String],
    refering_days_product_code: {
        type: String,
        uppercase: true
    }
}, { timestamps: true, _id: true });


const productSchema = new Schema({
    vendor_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'vendor_details'
    },
    title: {
        type: String,
        required: true
    },
    category_path: {
        type: String,
        required: true
    },
    brand: {
        type: String
    },
    variants: [productVariantSchema],
    is_blocked: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });



const productModel = mongoose.model('product_documents', productSchema);
module.exports = {
    productModel
}