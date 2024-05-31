var express = require("express");
var router  =express.Router({mergeParams : true});
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");
var middleware = require("../middleware/index.js");

router.get("/new",middleware.isLoggedin,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err)
			{
				req.flash("error","Something Went Wrong");
			}
		else{
			res.render("comments/new",{campgrounds:campground});
		}
	});
	
});
router.post("/",middleware.isLoggedin,function(req,res){
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
					 req.flash("success","successfully added Comment");
					 res.redirect("/campgrounds/"+campground._id);
				 }
			 });
		 }
	 });
});
//========================================
// comment Edit router
//==========================================
router.get("/:comment_id/edit",middleware.checkcommentowership,function(req,res){
	  Comment.findById(req.params.comment_id,function(error,foundcomment){
		  if(error)
			  req.flash("error","Something Went Wrong");
		  else
			  res.render("comments/edit",{campground_id :req.params.id,comment : foundcomment});
	  });
});
router.put("/:comment_id",middleware.checkcommentowership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(error,updateComment){
		if(error)
			res.redirect("back");
		else{
			req.flash("success","successfully Updated the Comment");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});
//==========================================
// Delete router
//===========================================
router.delete("/:comment_id",middleware.checkcommentowership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(error){
		if(error)
			req.flash("error","Something Went Wrong");
		else{
			req.flash("success","successfully Deleted the Comment");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

module.exports = router ;