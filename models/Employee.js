const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const employeeSchema = new mongoose.Schema({
    Employee_ID: {
        type: Number,
        required: true,
        unique: true,
    },
    Name: {
        type:String,
        required: true,
    },
    Username: {
        type: String,
        required: true,
        unique: true,
    },
    Password: {
        type: String,
        required: true,
      },
    Address_Staff: {
        type: String,
    },
    Tel_Staff: {
        type: String,
        validate: {
          validator: function (v) {
            return /^\d{10}$/.test(v); // ต้องมี 10 ตัวเป็นตัวเลข
          },
          message: 'Invalid phone number format',
        },
    },
    ID_Card: {
        type: String,
        validate: {
          validator: function (v) {
            return /^\d{13}$/.test(v); // ต้องมี 13 ตัวเป็นตัวเลข
          },
          message: 'Invalid ID card format',
        },
    },
    IMG: {
        type: String,
    },
});

employeeSchema.pre('save', function(next){
    if(!this.isModified('Password')) return next();
    const saltRounds = 10;
    bcrypt.hash(this.Password, saltRounds, (err, hash)=>{
        if(err) return next(err);
        this.Password = hash;
        next();
    });
});

employeeSchema.methods.comparePassword = function (password, callback) {
    bcrypt.compare(password, this.Password, (err, isMatch)=>{
        if(err) return callback(err);
        callback(null, isMatch);
    });
};

module.exports = mongoose.model('Employee', employeeSchema);