var express    = require("express"),
    app        = express(),
	bodyParser = require("body-parser"),
	flash      = require("connect-flash"),
	mongoose   = require("mongoose"),
	Campground = require("./models/campground"),
	Comment    = require("./models/comment"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	User = require("./models/user"),
	seedDB     = require("./seeds");

var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");

//seedDB; // seed the database
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useUnifiedTopology', true);

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("express"));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

//Passport config
app.use(require("express-session")({
	secret:"Rahul Gandhi is actually intelligent, it's all just for show!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
	res.locals.currentUser= req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})


app.use(indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);



app.listen(3000,function(){
	console.log("YelpCamp server is running");
});



















