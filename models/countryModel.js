const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const countrySchema = new Schema({
    country: {
        type: String,
        required: true,
        index: {
            unique: true
        },
        lowercase: true,
        trim: true
    },
    state_list: []
});


const countryModel = mongoose.model('country_documents', countrySchema);

module.exports = {
    countryModel
}