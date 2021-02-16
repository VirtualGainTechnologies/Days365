const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserRegisterSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        index: true,
        lowecase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowecase: true,
        trim: true
    },
    hash: {
        type: String,
        required: true
    }
}, { timestamps: true });





const UserRegisterModel = mongoose.model('user_registers', UserRegisterSchema);
module.exports = { UserRegisterModel };






