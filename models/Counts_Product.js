const mongoose = require('mongoose');


const countProductSchema = new mongoose.Schema({
    Employee_ID: {
        type: mongoose.Schema.Types.Number,
        ref: 'Employee',
    },
    Product_ID: {
        type: mongoose.Schema.Types.Number,
        ref: 'Product',
    },
    CountDate: {
        type: Date,
        required: true,
    },
    Count_sell: {
        type: Number,
        required: true,
    },
    expire: {
        type: String,
        required: true,
    },
    remaining: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('Counts_Product',countProductSchema);