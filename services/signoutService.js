const { refreshTokenModel } = require("../models/refreshTokenModel");



exports.getRefreshTokenRecord = async (userId) => {
    return await refreshTokenModel.findOne({ user_id: userId });
}


exports.updateRefreshTokenRecord = async (userId, updateQuery = {}) => {
    return await refreshTokenModel.findOneAndUpdate({ user_id: userId }, updateQuery).lean();
}