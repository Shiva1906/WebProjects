var express = require("express");
var router  =express.Router();
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");
var middleware = require("../middleware/index.js");
//campground page
router.get("/",function(req,res){
		Campground.find({},function(error,campgrounds){
			if(error)
				req.flash("error","Campground not found");
			else
				res.render("campgrounds/campgrounds",{ campgrounds :campgrounds});
		});
	
});
//route for creating campgraound in db 
router.post("/",middleware.isLoggedin,function(req,res){
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
			req.flash("error","Something Went Wrong");
		else
			res.redirect("/campgrounds");
	});
});
router.get("/new",middleware.isLoggedin,function(req,res){
	
	res.render("campgrounds/new");
});
router.get("/:id",function(req,res){
	
	Campground.findById(req.params.id).populate("comments").exec(function(error,foundcampground){
		if(error)
			req.flash("error","Campground not found");
		else
			{
				
			res.render("campgrounds/show",{campground : foundcampground});
			}
	});
});
///======================================//
//edit pages
//======================================//
router.get("/:id/edit",middleware.checkcampgroundowership,function(req,res){
	Campground.findById(req.params.id,function(error,foundcampground){
		if(error)
			{
				req.flash("error","Campground not found");
			}
		else{
			res.render("campgrounds/edit",{ campground : foundcampground});
		}
	});
});
//=========================================//
//upadte route
//=========================================//
router.put("/:id",middleware.checkcampgroundowership,function(req,res){
	
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(error,foundcampground){
		if(error)
			req.flash("error","Something Went Wrong");
		else{
			req.flash("success","Successfully Updated");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});
//==========================================//
//delete route
//==========================================//
router.delete("/:id",middleware.checkcampgroundowership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(error){
		if(error)
			req.flash("error","Something Went Wrong");
		else{
			req.flash("success","Successfully Deleted")
			res.redirect("/campgrounds");
		}
	});
});



module.exports = router ;
