var express = require("express");
var router = express.Router({mergeParams: true});
var Campground= require("../models/campground");
var Comment= require("../models/comment");
var middleware= require("../middleware"); // the index.js files in the directory will be included

//Comments Routes
// new comment
router.get("/new",middleware.isLoggedIn,(req,res)=>{
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new",{campground: campground});
		}
	})
	
})

// create comment
router.post("/",middleware.isLoggedIn,(req,res)=>{
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			Comment.create(req.body.comment,function(err, comment){
				if(err){
					req.flash("error","Something went wrong"); //database related
					console.log(err);
				}else{
					//add username and id to the comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//console.log(req.user.username);
					//console.log("this");
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success","Successfully added comment :)");
					res.redirect("/campgrounds/"+campground._id);
				}
			})
		}
	})
})

//comment edit
router.get("/:comment_id/edit",middleware.checkCommentOwner,(req,res)=>{
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err){
			res.redirect("back");
		}else{
			res.render("comments/edit",{campground_id: req.params.id, comment: foundComment});
		}
	})
	
})

//comment update
router.put("/:comment_id",middleware.checkCommentOwner,(req,res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})

//comment destroy route
router.delete("/:comment_id",middleware.checkCommentOwner,(req,res)=>{
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success","Comment deleted");
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})

module.exports = router;