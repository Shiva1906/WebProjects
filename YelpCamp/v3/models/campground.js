var mongoose = require("mongoose");
var comment =require("../models/comment.js");
console.log(comment);
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
	comments : [
		{
			type : mongoose.Schema.Types.ObjectId,
			ref : "Comment"
		}
	]

});

module.exports = mongoose.model("Campgrounds", campgroundSchema);