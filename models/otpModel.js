const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const otpSchema = new Schema({
    otp: {
        type: String,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    purpose: {
        type: String,
        required: true,
        enum: ["Reset Password"]
    },
    is_verified: {
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


const optModel = mongoose.model('otp_documents', otpSchema);

module.exports = {
    optModel
}















