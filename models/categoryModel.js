const mongoose = require('mongoose');
const MpathPlugin = require('mongoose-mpath');
const Schema = mongoose.Schema;


const categorySchema = new Schema({
    category_name: {
        type: String,
        required: true,
        index: {
            unique: true,
            collation: {
                locale: 'en',
                strength: 2
            }
        },
        trim: true
    },
    is_leaf: {
        type: Boolean,
        default: true,
        required: true
    },
    is_restricted: {
        type: Boolean,
        required: true,
        default: false
    },
    image_URL: {
        type: String
    }
}, { timestamps: true });

categorySchema.plugin(MpathPlugin);
const categoryModel = mongoose.model('category_documents', categorySchema);
module.exports = {
    categoryModel
}