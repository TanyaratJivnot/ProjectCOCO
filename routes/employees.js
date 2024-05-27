const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Employee = require('../models/Employee.js');

router.get('/', (req, res ,next)=>{
    Employee.find((err, employees) => {
        if (err) return next(err);
        res.json(employees);
    })
})
/* const Emp1 = [{
    Name: 'Supada Sutha',
    Username: 'Cream',
    Password: 'Cream06',
    Address_Staff: '254/555 BBB_City',
    Tel_Staff: '0985421337',
    ID_Card: '1025486858743',
    IMG: 'https://i.pinimg.com/564x/d8/87/09/d88709d3a267da32dab5046f8d99cd95.jpg',
}]
async function importEmp() {
    try {
        for (const emp of Emp1) {
            const { Employee_ID, Password, ...rest } = emp;

            // แฮชรหัสผ่านก่อนบันทึก
            const hashedPassword = await bcrypt.hash(Password, 10);

            await Employee.updateOne(
                { Employee_ID }, 
                { $set: { ...rest, Password: hashedPassword } }, 
                { upsert: true }
            );
            console.log(`Employee ${emp.Name} added or updated successfully!`);
        }
    } catch (error) {
        console.log('Error adding data', error);
    }
}
importEmp(); */
module.exports = router;