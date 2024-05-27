const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const TypeProduct = require('../models/Type_Product.js');

router.get('/', (req, res ,next)=>{
    TypeProduct.find((err, typeproduct) => {
        if (err) return next(err);
        res.json(typeproduct);
    })
})

module.exports = router;