const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const adminSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        index: {
            unique: true
        }
    },
    mobile_number: {
        type: String,
        index: {
            unique: true
        },
        required: true,
        trim: true
    },
    admin_rank: {
        type: String,
        required: true,
        enum: ["Super Admin", "Sub Admin"],
        default: "Sub Admin"
    },
    username: {
        type: String,
        index: {
            unique: true
        },
        lowercase: true,
        trim: true,
        required: true
    },
    hash: {
        type: String,
        required: true
    }
}, { timestamps: true });


const adminRegisterModel = mongoose.model('admin_registers', adminSchema);

module.exports = {
    adminRegisterModel
};
