const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const productTaxCodeSchema = new Schema({
    categoryName: {
        type: String,
        required: true
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    taxCode: {
        type: String,
        required: true,
        uppercase: true,
        index: {
            unique: true
        }
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    time_stamp: {
        type: Date,
        default: Date.now(),
        required: true
    }
});


const productTaxModel = mongoose.model('product_Tax_Code', productTaxCodeSchema);


module.exports = {
    productTaxModel
}












