const mongoose = require('mongoose');


const RefreshToken = new mongoose.Schema({
    refresh_token: {
        type: String,
        required: true
    },
    useragent: {
        type: {},
        required: true
    },
    _id: false,
}, { timestamps: true });


const RefreshTokenSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    refresh_tokens: [RefreshToken]
}, { timestamps: true });

const refreshTokenModel = mongoose.model('refresh_tokens', RefreshTokenSchema);
module.exports = { refreshTokenModel };