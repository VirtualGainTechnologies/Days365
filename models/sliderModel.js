const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const sliderSchema = new Schema({
    image: {
        type: String,
        required: true,
        unique: true
    }
});


const sliderModel = mongoose.model('slider', sliderSchema);
module.exports = { sliderModel };