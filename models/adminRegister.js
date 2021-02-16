const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const AdminRegisterSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        index: true,
        lowecase: true,
        trim: true
    },
    hash: {
        type: String,
        required: true
    }
}, { timestamps: true });





const adminRegisterModel = mongoose.model('admin_registers', AdminRegisterSchema);
module.exports = { adminRegisterModel };






