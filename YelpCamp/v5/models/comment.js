
var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
	auther : String,
	text : String 
});

module.exports =  mongoose.model("Comment",commentSchema) ;