const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const utilitySchema = new Schema({
    utility_name: {
        type: String,
        index: {
            unique: true
        },
        required: true,
        uppercase: true
    },
    utility_data: {
        type: Schema.Types.Mixed,
        required: true
    }
});



const utilityModel = mongoose.model('utility_documents', utilitySchema);
module.exports = {
    utilityModel
}