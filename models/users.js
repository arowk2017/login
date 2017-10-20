var mongoose = require('mongoose');
Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var bcrypt   = require('bcrypt-nodejs');

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

module.exports = mongoose.model('Users', UsersSchema);