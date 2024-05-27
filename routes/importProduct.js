const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const impoertProduct = require('../models/import_Product');

router.get('/', (req, res ,next)=>{
    impoertProduct.find((err, impoert) => {
        if (err) return next(err);
        res.json(impoert);
    })
})


module.exports = router;