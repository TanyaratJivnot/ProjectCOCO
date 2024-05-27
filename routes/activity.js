const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const activity = require('../models/ActivityLog.js');

router.get('/', (req, res ,next)=>{
    activity.find((err, activity) => {
        if (err) return next(err);
        res.json(activity);
    })
})

module.exports = router;