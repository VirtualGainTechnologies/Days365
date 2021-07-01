const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const brandSchema = new Schema({
    
    brandName: {
        type: String,
        trim: true,
        required: true
        //index: true
    },
    
    registrationNo: {
        type: String,
        trim: true,
        required: true
    },

    brandWebsite: {
        type: String,
        trim: true,
        required: true
    },

    category: {
        type: String,
        trim: true,
        required: true
    },

    Percentage: {
        type: Number,
        required: true,
        default:0
    },

    image : {
        type: String
    },
    
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Active', 'Rejected'],
        default: "Pending",
        index: true
    }
}, { timestamps: true });

const brandModel = mongoose.model('brand_documents', brandSchema);
module.exports = {
    brandModel
}