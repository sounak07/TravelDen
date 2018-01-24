var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
   username:String,
   password: String,
   picture:String,
   firstname:String,
   lastname:String,
   email:{type:String, unique:true},
   resetPasswordToken:String,
   resetPasswordExpires:Date,
   isAdmin:{type:Boolean, default: false}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);