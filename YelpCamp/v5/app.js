var express = require("express");
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var passport =require("passport");
var LocalStrategy =require("passport-local");
var passportlocalmongoose = require("passport-local-mongoose");
var Campground = require("./models/campground.js");
var User = require("./models/user.js");
var Comment = require("./models/comment.js");
var seeddb = require("./seed.js");
mongoose.connect('mongodb://localhost:27017/Yelp_camp', {useNewUrlParser: true,useUnifiedTopology : true});
var app =express();
app.use(bodyparser.urlencoded({extended :true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
seeddb();

app.use(require("express-session")({
   	secret : "Keep this secret",
	resave : false,
	saveUninitialized : false
}
));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});
app.get("/",function(req,res){
	res.render("landing");
});
//=====================
//Campgrounds Routes
//=====================
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
app.get("/campgrounds/:id/comments/new",isLoggedin,function(req,res){
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
app.post("/campgrounds/:id/comments",isLoggedin,function(req,res){
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
//=======================
//Authentication Routes
//=======================

// register Page 
app.get("/register",function(req,res){
	res.render("register");
});
app.post("/register",function(req,res){
	var newuser = new User({
		username : req.body.username
	});
	User.register(newuser,req.body.password,function(error,user){
		if(error)
			return res.redirect("/register");
		passport.authenticate("local")(req,res,function(error){
			res.redirect("/campgrounds");
		});
	});
});
//=========login Page===========//
app.get("/login",function(req,res){
	 res.render("login");
});
app.post("/login",passport.authenticate("local",{
	successRedirect : "/campgrounds",
	failureRedirect : "/login"
}),function(req,res){});
app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
});
function isLoggedin(req,res,next){
	if(req.isAuthenticated())
		return next();
	res.redirect("/login");
}

app.listen(3000,function(){
	console.log("Server Started");
});