// models/ActivityLogNew.js
const mongoose = require('mongoose');

const activityLogNewSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    Employee_ID: {
        type: mongoose.Schema.Types.Number,
        ref: 'Employee', 
    },
    Activity_Type: {
        type: String,
        required: true,
    },
    Activity_Timestamp: {
        type: Date,
        required: true,
    }
});

module.exports = mongoose.model('ActivityLogNew', activityLogNewSchema, 'activitylog');
