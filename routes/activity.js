const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ActivityLogNew = require('../models/ActivityLog.js');

router.get('/', (req, res ,next)=>{
    ActivityLogNew.find((err, activity) => {  // เปลี่ยนจาก activity เป็น ActivityLogNew
        if (err) return next(err);
        res.json(activity);
    });
});

module.exports = router;