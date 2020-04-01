var express = require("express");
var router = express.Router();
var Campground= require("../models/campground");
var middleware = require("../middleware"); // the index.js files in the directory will be included

//index- show all camps
router.get("/",function(req,res){
	//get all camps from db
	Campground.find({},(err,campgrounds)=>{
		if(err) {
			console.log("Error  finding all Camps!");
		}
		else {
			res.render("campgrounds/index",{campgrounds:campgrounds, currentUser:req.user});
		}
	});
});


//create route
router.post("/",middleware.isLoggedIn,function(req,res){
	//get data from form and add to camps
	var name= req.body.name;
	var image=req.body.image;
	var description=req.body.description;
	var price=req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	
	var newCamp = {name: name, image: image,description: description, author:author,price: price};
	Campground.create(newCamp,(err,newlyCreated)=>{
		if(err){
			console.log("Error creating new Camp!");
		}
		else{
			res.redirect("/campgrounds");
		}
	});
});

//new campground
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new.ejs");
});

//show a campground
router.get("/:id",(req,res)=>{
	var id= req.params.id;
	Campground.findById(id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log("Error");
		}
		else {
			console.log(foundCampground);
			res.render("campgrounds/show",{campground:foundCampground});
		}
	});
	
});

//edit camp route
router.get("/:id/edit",middleware.checkCampOwner,(req,res)=>{
	Campground.findById(req.params.id,function(err,foundCampground){
			if(err){
				res.redirect("back");
			}
			res.render("campgrounds/edit",{campground: foundCampground});
	});
});

//update camp route
router.put("/:id",(req,res)=>{
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCamp){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})

//delete route
router.delete("/:id",(req,res)=>{
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	})
})



module.exports = router;