const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const productVariantSchema = new Schema({
    color: {
        type: String,
        default: "N/A",
        required: true,
        uppercase: true
    },
    size: {
        type: String,
        default: "N/A",
        required: true,
        uppercase: true
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
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    offer_price: {
        type: Number,
        required: true,
        index: true
    },
    offer_description: {
        type: String
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        index: true
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
    product_bill_image_URL: {
        type: String
    },
    product_details_image_URL: {
        type: String,
        required: true
    }
}, { timestamps: true, _id: true });



const ratingSchema = new Schema({
    five: {
        type: Number,
        default: 0,
        required: true
    },
    four: {
        type: Number,
        default: 0,
        required: true
    },
    three: {
        type: Number,
        default: 0,
        required: true
    },
    two: {
        type: Number,
        default: 0,
        required: true
    },
    one: {
        type: Number,
        default: 0,
        required: true
    },
    total_rating: {
        type: Number,
        required: true,
        default: 0,
        index: true
    }
}, { _id: false });



ratingSchema.methods.setRating = function () {
    let totalCount = parseInt(this.five + this.four + this.three + this.two + this.one) || 1;
    let rating = ((this.five * 5) + (this.four * 4) + (this.three * 3) * (this.two * 2) + (this.one * 1)) / totalCount;
    this.total_rating = parseFloat(rating).toFixed(1);
}

ratingSchema.methods.getRating = function () {
    return this.total_rating;
}


const productSchema = new Schema({
    vendor_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user_registers',
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    category_path: {
        type: String,
        required: true,
        trim: true
    },
    category_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'category_documents'
    },
    brand_name: {
        type: String,
        trim: true,
        required: true,
        index: true
    },
    variants: [productVariantSchema],
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Active', 'Blocked'],
        default: "Pending",
        index: true
    },
    key_words: {
        type: String,
        required: true,
        trim: true,
    },
    reference_id: {
        type: Schema.Types.ObjectId
    },
    customer_rating: ratingSchema
}, { timestamps: true });



const productModel = mongoose.model('product_documents', productSchema);
module.exports = {
    productModel
}