const mongoose = require('mongoose');


const importProductSchema = new mongoose.Schema({
    Employee_ID: {
        type: mongoose.Schema.Types.Number,
        ref: 'Employee',
    },
    Product_ID: {
        type: mongoose.Schema.Types.Number,
        ref: 'Product',
    },
    ImportDate: {
        type: String,
        required: true,
    },
    Count: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('Import_Product',importProductSchema);