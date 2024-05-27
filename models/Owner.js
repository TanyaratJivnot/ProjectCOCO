const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const ownerSchema = new mongoose.Schema({
    Owner_ID: {
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
});

ownerSchema.pre('save', function(next){
    if(!this.isModified('Password')) return next();
    const saltRounds = 10;
    bcrypt.hash(this.Password, saltRounds, (err, hash)=>{
        if(err) return next(err);
        this.Password = hash;
        next();
    });
});

ownerSchema.methods.comparePassword = function (password) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, this.Password, (err, isMatch) => {
            if (err) return reject(err);
            resolve(isMatch);
        });
    });
};

module.exports = mongoose.model('Owner', ownerSchema);