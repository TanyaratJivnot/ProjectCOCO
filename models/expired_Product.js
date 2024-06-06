const mongoose = require('mongoose');

const expiredProductSchema = new mongoose.Schema({
    Product_ID: {
        type: mongoose.Schema.Types.Number,
        ref: 'Product',
        required: true
    },
    ImportDate: {
        type: String,
        required: true,
    },
    ImportDateExpire: {
        type: String,
        required: true,
    },
    Count: {
        type: Number,
        required: true,
    }
});

module.exports = mongoose.model('Expired_Product', expiredProductSchema);
