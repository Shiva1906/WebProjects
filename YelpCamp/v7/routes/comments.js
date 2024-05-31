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
//========================================
// comment Edit router
//==========================================
router.get("/:comment_id/edit",checkcommentowership,function(req,res){
	  Comment.findById(req.params.comment_id,function(error,foundcomment){
		  if(error)
			  res.redirect("back");
		  else
			  res.render("comments/edit",{campground_id :req.params.id,comment : foundcomment});
	  });
});
router.put("/:comment_id",checkcommentowership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(error,updateComment){
		if(error)
			res.redirect("back");
		else
			res.redirect("/campgrounds/"+req.params.id);
	});
});
//==========================================
// Delete router
//===========================================
router.delete("/:comment_id",checkcommentowership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(error){
		if(error)
			res.redirect("back");
		else
			res.redirect("/campgrounds/"+req.params.id);
	});
});
function checkcommentowership(req,res,next){
   if(req.isAuthenticated())
	   {
		   Comment.findById(req.params.comment_id,function(error,foundcomment){
			  if(error)
				  res.redirect("back");
			   else{
				   if(foundcomment.auther.id.equals(req.user._id))
					   {
						   next();
					   }
				   else
					   {
						   res.redirect("back");
					   }
			   }
		   });
	   }
	else{
		res.redirect("back");
	}
};

function isLoggedin(req,res,next){
	if(req.isAuthenticated())
		return next();
	res.redirect("/login");
}
module.exports = router ;