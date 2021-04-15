const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const categorySchema = new Schema({
    category_name: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    },
    is_parent: {
        type: Boolean,
        default: true,
        required: true
    },
    parent_id: {
        type: mongoose.Types.ObjectId,
        ref: 'category_documents'
    }
});


const categoryModel = mongoose.model('category_documents', categorySchema);
module.exports = {
    categoryModel
}