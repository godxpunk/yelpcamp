var express = require("express");
var router = express.Router();
var passport= require("passport");
var User = require("../models/user");


router.get("/",function(req,res){
	res.render("home");
});

//Authentication Routes
router.get("/register",(req,res)=>{
	res.render("register");
});

//handle signUp logic
router.post("/register",(req,res)=>{
	var newUser = new User({username: req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			req.flash("error",err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to YelpCamp "+user.username);
			res.redirect("/campgrounds");
		})
	});
})

//login form
router.get("/login",(req,res)=>{
	res.render("login");
})

//handle login logic
router.post("/login",passport.authenticate("local",
{
	successRedirect:"/campgrounds",
	failureRedirect:"/login",
    failureFlash: true,
	successFlash: 'Welcome to YelpCamp!'
		}),(req,res)=>{
})

//logout route
router.get("/logout",(req,res)=>{
	req.logout();
	req.flash("success","Logged you out");
	res.redirect("/campgrounds");
});

module.exports = router;