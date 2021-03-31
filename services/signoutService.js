const { refreshTokenModel } = require("../models/refreshTokenModel");



exports.getRefreshTokenRecord = async (userId) => {
    return await refreshTokenModel.findOne({ userid: userId });
}


exports.updateRefreshTokenRecord = async (userId, updateQuery) => {
    return await refreshTokenModel.findOneAndUpdate({ userid: userId }, updateQuery);
}