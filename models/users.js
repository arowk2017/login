var mongoose = require('mongoose');
Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var bcrypt   = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

var UsersSchema = new mongoose.Schema({
    username: String,
    password: String,
    
},
  {
    timestamps: true
 
});

UsersSchema.plugin(passportLocalMongoose);

// checking if password is valid
UsersSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

UsersSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UsersSchema.methods.generateJwt = function() {
    var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    exp: parseInt(expiry.getTime() / 1000),
  }, process.env.LOGIN_SECRET); 
};

module.exports = mongoose.model('Users', UsersSchema);