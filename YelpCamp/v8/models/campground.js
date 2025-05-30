var mongoose = require("mongoose");
var comment =require("../models/comment.js");
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
	auther :{
	  id : {
		  type : mongoose.Schema.Types.ObjectId,
		  ref : "User"
	  }	,
	 username : String 	
	},
	comments : [
		{
			type : mongoose.Schema.Types.ObjectId,
			ref : "Comment"
		}
	]

});

module.exports = mongoose.model("Campgrounds", campgroundSchema);