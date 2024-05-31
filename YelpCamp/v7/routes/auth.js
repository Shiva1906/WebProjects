var express = require("express");
var router  =express.Router();
var passport =require("passport");
var LocalStrategy =require("passport-local");
var passportlocalmongoose = require("passport-local-mongoose");
var User = require("../models/user.js");

router.get("/",function(req,res){
	res.render("landing");
});



// register Page 
router.get("/register",function(req,res){
	res.render("register");
});
router.post("/register",function(req,res){
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
router.get("/login",function(req,res){
	 res.render("login");
});
router.post("/login",passport.authenticate("local",{
	successRedirect : "/campgrounds",
	failureRedirect : "/login"
}),function(req,res){});
router.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
});
function isLoggedin(req,res,next){
	if(req.isAuthenticated())
		return next();
	res.redirect("/login");
}

module.exports = router ;