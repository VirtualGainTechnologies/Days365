const mongoose = require('mongoose');


const UserRegisterSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    mobile_number: {
        country_code: {
            type: String,
            required: true,
            default: "+91"
        },
        number: {
            type: String,
            required: true
        }
    },
    email: {
        type: String,
        unique: true,
        lowecase: true,
        trim: true
    },
    hash: {
        type: String,
        required: true
    },
    is_verified: {
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





const UserRegisterModel = mongoose.model('user_registers', UserRegisterSchema);
module.exports = { UserRegisterModel };






