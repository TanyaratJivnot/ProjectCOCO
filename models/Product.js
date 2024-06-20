const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    Product_ID: {
        type: Number,
        required: true,
        unique: true,
    },
    Category_ID: {
        type: mongoose.Schema.Types.Number,
        ref: 'Category_Product',
        required: true,
    },
    Type_ID: {
        type: mongoose.Schema.Types.Number,
        ref: 'Type_Product',
        required: true,
    },
    Barcode: {
        type: String,
    },
    NameProduct: {
        type: String,
        required: true,
    },
    PricePrduct: {
        type: Number,
    },
    ImageProduct: {
        type: String,
    },
    ImageTypeProduct: {
        type: String,
    },
    Day_expire: {
        type: Number,
    },
    DetailProduct: {
        type: String,
    },
});

module.exports = mongoose.model('Product', productSchema);