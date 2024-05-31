var express = require("express");
var router  =express.Router({mergeParams : true});
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");

router.get("/new",isLoggedin,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err)
			{
				console.log("Error");
			}
		else{
			res.render("comments/new",{campgrounds:campground});
		}
	});
	
});
router.post("/",isLoggedin,function(req,res){
	 Comment.create(req.body.comment,function(error,comment){
		if(error)
			console.log("Error");
		 else{
			 Campground.findById(req.params.id,function(error,campground){
				if(error)
					console.log("Error");
				 else{
					 comment.auther.id = req.user._id;
					 comment.auther.username = req.user.username;
					 comment.save();
					 campground.comments.push(comment);
					 campground.save();
					 res.redirect("/campgrounds/"+campground._id);
				 }
			 });
		 }
	 });
});
function isLoggedin(req,res,next){
	if(req.isAuthenticated())
		return next();
	res.redirect("/login");
}
module.exports = router ;