const mongoose = require('mongoose');


const AdminRegisterSchema = new mongoose.Schema({
    fullname: {
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






