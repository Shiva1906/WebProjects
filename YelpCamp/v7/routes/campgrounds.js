var express = require("express");
var router  =express.Router();
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");

router.get("/",function(req,res){
		Campground.find({},function(error,campgrounds){
			if(error)
				console.log("ERROR");
			else
				res.render("campgrounds/campgrounds",{ campgrounds :campgrounds});
		});
	
});
router.post("/",isLoggedin,function(req,res){
	var name =req.body.name;
	var image = req.body.image;
	var description =req.body.description;
	var auther ={
		id : req.user._id,
		username : req.user.username
	};
	var newcampground ={
		name :name,
		image :image,
		description :description,
		auther : auther
	}
	Campground.create(newcampground,function(error,campgrounds){
		if(error)
			console.log("ERROR");
		else
			res.redirect("/campgrounds");
	});
});
router.get("/new",isLoggedin,function(req,res){
	
	res.render("campgrounds/new");
});
router.get("/:id",function(req,res){
	
	Campground.findById(req.params.id).populate("comments").exec(function(error,foundcampground){
		if(error)
			console.log(error);
		else
			{
				
			res.render("campgrounds/show",{campground : foundcampground});
			}
	});
});
///======================================//
//edit pages
//======================================//
router.get("/:id/edit",checkcampgroundowership,function(req,res){
	Campground.findById(req.params.id,function(error,foundcampground){
		if(error)
			{
				console.log("Error");
			}
		else{
			res.render("campgrounds/edit",{ campground : foundcampground});
		}
	});
});
//=========================================//
//upadte route
//=========================================//
router.put("/:id",checkcampgroundowership,function(req,res){
	
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(error,foundcampground){
		if(error)
			console.log("Error");
		else
			res.redirect("/campgrounds/"+req.params.id);
	});
});
//==========================================//
//delete route
//==========================================//
router.delete("/:id",checkcampgroundowership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(error){
		if(error)
			console.log(error);
		else
			res.redirect("/campgrounds");
	});
});

function isLoggedin(req,res,next){
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
						   res.redirect("back");
					   }
			   }
		   });
	   }
	else{
		res.redirect("back");
	}
};

module.exports = router ;
