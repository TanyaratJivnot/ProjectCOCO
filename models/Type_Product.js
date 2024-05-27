const mongoose = require('mongoose');

const typeProductSchema = new mongoose.Schema({
    Type_ID: {
        type: Number,
        required: true,
        unique: true,
    },
    NameType: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Type_Product', typeProductSchema)