const mongoose = require('mongoose');

const preSignUpSchema = new mongoose.Schema({
    mobile: {
        type: String,
        required: true,
        trim: true
    },
    data: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true,
        trim: true
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


const preSignUpModel = mongoose.model('presignup_documents', preSignUpSchema);
module.exports = { preSignUpModel };