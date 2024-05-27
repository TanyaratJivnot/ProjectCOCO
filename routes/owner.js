const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Owner = require('../models/Owner.js');

router.get('/', (req, res ,next)=>{
    Owner.find((err, owner) => {
        if (err) return next(err);
        res.json(owner);
    })
})

const owner1 = [{
    Owner_ID: 1,
    Name: 'owner',
    Username: 'owner',
    Password: '123',
}]
async function importOwner() {
    try {
        for (const owner of owner1) {
            const { Owner_ID, Password, ...rest } = owner;

            // แฮชรหัสผ่านก่อนบันทึก
            const hashedPassword = await bcrypt.hash(Password, 10);

            await Owner.updateOne(
                { Owner_ID }, 
                { $set: { ...rest, Password: hashedPassword } }, 
                { upsert: true }
            );
            console.log(`Owner ${owner.Name} added or updated successfully!`);
        }
    } catch (error) {
        console.log('Error adding data', error);
    }
}

/* importOwner(); */

module.exports = router;


