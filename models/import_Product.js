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
    ImportTime: {
        type: String,
        required: true,
    },
    Count: {
        type: Number,
        required: true,
    },
    ExpirationDate: {
        type: String,
        required: true,
    },
    ExpirationTime: {
        type: String,
        required: true,
    },
});

// Function to calculate import time, expiration date and time
importProductSchema.pre('save', function (next) {
    const currentDate = new Date();
    this.ImportDate = currentDate.toISOString().slice(0, 10); // format: "YYYY-MM-DD"
    this.ImportTime = currentDate.toTimeString().slice(0, 5); // format: "HH:mm"
    const expirationDate = new Date(currentDate.getTime() + 5 * 60000); // 5 minutes from now

    this.ExpirationDate = expirationDate.toISOString().slice(2, 10); // format: "YY-MM-DD"
    this.ExpirationTime = expirationDate.toTimeString().slice(0, 5); // format: "HH:mm"

    next();
});

module.exports = mongoose.model('Import_Product', importProductSchema);
