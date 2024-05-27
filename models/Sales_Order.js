const mongoose = require('mongoose');

const salesOderSchema = new mongoose.Schema({
    Employee_ID: {
        type: mongoose.Schema.Types.Number,
        ref: 'Employee', 
    },
    Product_ID: {
        type: mongoose.Schema.Types.Number,
        ref: 'Product', 
    },
    Order_Date: {
        type: Date,
        required: true,
    },
    Total_Amount: {
        type: Number,
        required: true,
    },
    Rain: {
        type: Number,
        required: true,
    },
    Time_Stamp: {
        type: String,
        require: true
    },
    Payment_Methods: {
        type: String,
        require: true
    },
    Wather: {
        type: Number,
        require: true
    },
});

module.exports = mongoose.model('Sales_Order', salesOderSchema);