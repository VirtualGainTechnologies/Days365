const mongoose = require('mongoose');


const UserRegisterSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    mobile_number: {
        country_code: {
            type: String,
            required: true,
            default: "+91"
        },
        number: {
            type: String,
            unique: true,
            required: true,
            index: true,
            trim: true
        }
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        sparse: true
    },
    hash: {
        type: String,
        required: true
    },
    is_vendor: {
        type: Boolean,
        required: true,
        default: false
    },
    is_blocked: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });





const userRegisterModel = mongoose.model('user_registers', UserRegisterSchema);
module.exports = { userRegisterModel };






