const mongoose = require('mongoose');

const categoryProductSchema = new mongoose.Schema({
    Category_ID: {
        type: Number,
        required: true,
        unique: true,
    },
    NameCategory: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Category_Product', categoryProductSchema)