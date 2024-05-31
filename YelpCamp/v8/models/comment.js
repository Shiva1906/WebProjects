
var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
	auther :{
	  id : {
		  type : mongoose.Schema.Types.ObjectId,
		  ref : "User"
	  }	,
	 username : String 	
	},
	text : String 
});

module.exports =  mongoose.model("Comment",commentSchema) ;