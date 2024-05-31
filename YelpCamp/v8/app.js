var express = require("express");
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var passport =require("passport");
var LocalStrategy =require("passport-local");
var passportlocalmongoose = require("passport-local-mongoose");
//models........................................
var Campground = require("./models/campground.js");
var User = require("./models/user.js");
var Comment = require("./models/comment.js");
//Routes...................................
var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var authRoutes = require("./routes/auth");
var seeddb = require("./seed.js");
var methodoverride = require("method-override");
var flash = require("connect-flash");
var app =express();
require("dotenv").config();
// override with POST having ?_method=DELETE
app.use(methodoverride("_method"));
var url = process.env.DatabaseURL || "mongodb://localhost:27017/Yelp_camp" ;
mongoose.connect(url, {useNewUrlParser: true,useUnifiedTopology : true,useFindAndModify : false});
app.use(flash());
app.use(bodyparser.urlencoded({extended :true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
//seeddb();  //seeding db
app.use(require("express-session")({
   	secret : "Keep this secret",
	resave : false,
	saveUninitialized : false
}
));
///=======================================================//
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
   next();
});
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use(authRoutes);
//=========================================================//

app.listen(process.env.PORT || 3000||3001,function(){
	console.log("Server Started");
});