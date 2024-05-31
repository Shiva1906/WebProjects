var mongoose = require("mongoose");
var Campground = require("./models/campground.js");
//var Comment =require("./models/comment.js");
var data =[
	{
		name : "shiva",
		image :"https://tse1.mm.bing.net/th?id=OIP.Iclw2O0_wl9ec6Xhxps-OgHaEM&pid=Api&P=0&w=294&h=167",
		description :"hello hello hello"
	},
	{
		name : "charan",
		image :"https://tse4.mm.bing.net/th?id=OIP.iezcBRbEEDRNQHDu0ibozQHaDb&pid=Api&P=0&w=360&h=168",
		description :"hello hello hello"
	},
	{
		name : "chintha",
		image :"https://tse3.mm.bing.net/th?id=OIP.K-1twIOb8djJlRhUNXxvDQHaCx&pid=Api&P=0&w=540&h=203",
		description :"hello hello hello"
	}
]
 function seeddb(){
	 Campground.deleteMany({},function(error){
		if(error)
			console.log("ERROR in seed_remove");
		 else
			 {
				 console.log("campground removed");
				data.forEach(function(campground){
					Campground.create(campground,function(error,campground){
						if(error)
							console.log("ERROR in Campground create in seed");
						else{
							console.log("campground Add");
							// Comment.create({
							// 	auther : "shiva",text :"nice pic"
							// },function(error,comment){
							// 	if(error)
							// 		console.log("Error");
							// 	else
							// 	 campground.comment.push(comment);
							// });
							
						}
							
					});
				});
				
			 }
	 });
	 
 }
module.exports = seeddb;