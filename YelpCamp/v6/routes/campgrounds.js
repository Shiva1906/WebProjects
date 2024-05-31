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
function isLoggedin(req,res,next){
	if(req.isAuthenticated())
		return next();
	res.redirect("/login");
}

module.exports = router ;
