var express = require("express");
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js");
var seeddb = require("./seed.js");
mongoose.connect('mongodb://localhost:27017/Yelp_camp', {useNewUrlParser: true,useUnifiedTopology : true});
var app =express();
app.use(bodyparser.urlencoded({extended :true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
seeddb();
app.get("/",function(req,res){
	res.render("landing");
});
app.get("/campgrounds",function(req,res){
		Campground.find({},function(error,campgrounds){
			if(error)
				console.log("ERROR");
			else
				res.render("campgrounds/campgrounds",{ campgrounds :campgrounds});
		});
	
});
app.post("/campgrounds",function(req,res){
	var name =req.body.name;
	var image = req.body.image;
	var description =req.body.description;
	var newcampground ={
		name :name,
		image :image,
		description :description
	}
	Campground.create(newcampground,function(error,campgrounds){
		if(error)
			console.log("ERROR");
		else
			res.redirect("/campgrounds");
	});
});
app.get("/campgrounds/new",function(req,res){
	
	res.render("campgrounds/new");
});
app.get("/campgrounds/:id",function(req,res){
	
	Campground.findById(req.params.id).populate("comments").exec(function(error,foundcampground){
		if(error)
			console.log(error);
		else
			{
				
			res.render("campgrounds/show",{campground : foundcampground});
			}
	});
});
//===============
// Comment Routes
//===============
app.get("/campgrounds/:id/comments/new",function(req,res){
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
app.post("/campgrounds/:id/comments",function(req,res){
	 Comment.create(req.body.comment,function(error,comment){
		if(error)
			console.log("Error");
		 else{
			 Campground.findById(req.params.id,function(error,campground){
				if(error)
					console.log("Error");
				 else{
					 campground.comments.push(comment);
					 campground.save();
					 res.redirect("/campgrounds/"+campground._id);
				 }
			 });
		 }
	 });
});
app.listen(3000,function(){
	console.log("Server Started");
});