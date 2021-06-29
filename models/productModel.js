const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const productVariantSchema = new Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },
    
    daysProductCode: {
        type: String,
        uppercase: true,
        index: {
            unique: true
        }
    },
    productId:{
        type: String,
        trim: true,
        index: true
    },
    productIdType:{
        type: String,
        trim: true,
        index: true
    },
    color: {
        type: String,
        default: "N/A",
        uppercase: true
    },
    size: {
        type: String,
        default: "N/A",
        uppercase: true
    },
 
    SKUId: {
        type: String,
    },
    ingredients: {
        type: String
    },
    how_to_use: {
        type: String
    },
    yourPrice:{
        type: Number,
        index: true,
        default:0
    },
   
    maximumRetailPrice:{
        type: Number,
        trim: true,
        index: true,
        default:0
    },
    offerPrice: {
        type: Number,
        index: true
    },
    offerDescription: {
        type: String
    },
    stock: {
        type: Number,
        default: 0,
        index: true
    },
    MainImg: {
        type: String
    },
    expiryDate_Img: {
        type: String  
    },
    importerMRP_Img: {
        type: String
    },
    productSeal_Img: {
        type: String
    },
    product_Img1: {
        type: String
    },
    product_Img2: {
        type: String
    },
    product_Img3: {
        type: String
    },
    product_Img4: {
        type: String
    },
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
    venderName:{
        type: String,
        required: true
    },
  
    title: {
        type: String,
        required: true,
        trim: true
    },
    countryOfOrigin:{
        type: String,
        trim: true
    },
    manuFacturer:{
        type: String,
        trim: true
    },
    brandName:{
        type: String,
        trim: true,
        index: true
    },
    // color:{
    //     type: String,
    //     trim: true
    // },
    minRecommendedAge:{
        type: Number,
        trim: true,
        default:0
    },
    isProductExpirable:{
        type: String,
        trim: true
    },
    condition:{
        type: String,
        trim: true
    },
    conditionNote:{
        type: String,
        trim: true
    },
    // quantity:{
    //     type: Number,
    //     trim: true,
    //     default:0
    // },
    // maxOrderQuantity:{
    //     type: Number,
    //     trim: true,
    //     default:0
    // },
    // salePrice:{
    //     type: Number,
    //     trim: true,
    //     default:0
    // },
  
    // maximumRetailPrice:{
    //     type: Number,
    //     trim: true,
    //     default:0
    // },
    handlingPeriod:{
        type: Number,
        trim: true,
        default:0
    },
    productDescription:{
        type: String,
        trim: true
    },
    legalClaimer:{
        type: String,
        trim: true
    },
    bulletPoint:{
        type: Number,
        trim: true
    },
    searchTermsArr:{
        type: Array,
        trim: true
    },
    targetAudience:{
        type: Array,
        trim: true
    },
    shippingCharges:{
        type: String,
        trim: true
    },
    shippingChargesAmt:{
        type: Number,
        trim: true,
        default:0
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
    categoryName:{
        type: String,
    },

    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Active','Processing','Rejected'],
        default: "Pending",
        index: true
    },
    
    reference_id: {
        type: Schema.Types.ObjectId
    },
    productVariant : [productVariantSchema]
    // feature: {
    //     type: String,
    // },
    // customer_rating: ratingSchema,
}, { timestamps: true });



const productModel = mongoose.model('product_documents', productSchema);
module.exports = {
    productModel
}