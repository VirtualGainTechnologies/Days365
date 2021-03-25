const { refreshTokenModel } = require("../models/refreshTokenModel");



exports.getRefreshTokenRecord = async (userId) => {
    return await refreshTokenModel.findOne({ userid: userId });
}

