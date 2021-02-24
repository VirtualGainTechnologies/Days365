const mongoose = require('mongoose');


const RefreshTokenSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    refresh_tokens: []
});

const refreshTokenModel = mongoose.model('refresh_tokens', RefreshTokenSchema);
module.exports = { refreshTokenModel };