const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Sales = require('../models/Sales_Order.js');

router.get('/', (req, res ,next)=>{
    Sales.find((err, sales) => {
        if (err) return next(err);
        res.json(sales);
    })
})

module.exports = router;