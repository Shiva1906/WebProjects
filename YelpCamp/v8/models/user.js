var mongoose = require("mongoose");
var passportlocalmongoose = require("passport-local-mongoose");

var userSchema = mongoose.Schema({
	username : String,
	password : String
});
userSchema.plugin(passportlocalmongoose);

module.exports = mongoose.model("User",userSchema);