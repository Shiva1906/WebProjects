var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");
var middleware ={};
middleware.checkcampgroundowership = function(req,res,next){
	if(req.isAuthenticated())
		return next();
	res.redirect("/login");
}
function checkcampgroundowership(req,res,next){
   if(req.isAuthenticated())
	   {
		   Campground.findById(req.params.id,function(error,foundcampground){
			  if(error)
				  res.redirect("back");
			   else{
				   if(foundcampground.auther.id.equals(req.user._id))
					   {
						   next();
					   }
				   else
					   {
						   req.flash("error","Something Went Wrong");
						   res.redirect("back");
					   }
			   }
		   });
	   }
	else{
		req.flash("error","you must login to do the action");
		res.redirect("back");
	}
};
middleware.checkcommentowership = function(req,res,next){
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
						  req.flash("error","Something Went Wrong");
						   res.redirect("back");
					   }
			   }
		   });
	   }
	else{
		req.flash("error","you must login to do the action");
		res.redirect("back");
	}
};
middleware.isLoggedin=function(req,res,next){
	if(req.isAuthenticated())
		return next();
	req.flash("error","you must login to do the action");
	res.redirect("/login");
}
module.exports = middleware ;