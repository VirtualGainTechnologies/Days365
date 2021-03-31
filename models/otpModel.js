const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const otpSchema = new Schema({
    otp: {
        type: String,
        required: true
    },
    userid: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    purpose: {
        type: String,
        required: true,
        enum: ["Reset Password"]
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















