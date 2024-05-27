const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Category = require('../models/Category_Product.js');

router.get('/', (req, res ,next)=>{
    Category.find((err, category) => {
        if (err) return next(err);
        res.json(category);
    })
})
module.exports = router;