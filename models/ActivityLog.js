const mongoose = require('mongoose');

const activityLogschema = new mongoose.Schema({
    log_ID: {
        type: Number,
        required: true,
        unique: true,
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

module.exports = mongoose.model('ActivityLog', activityLogschema);
