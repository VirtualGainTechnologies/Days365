const mongoose = require('mongoose');

const preSignUpSchema = new mongoose.Schema({
    mobile: {
        type: String,
        required: true,
    },
    data: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    user_type: {
        type: String,
        required: true,
        enum: ["user", "vendor", "admin"]
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    }
});


const preSignUpModel = mongoose.model('presignup_records', preSignUpSchema);
module.exports = { preSignUpModel };