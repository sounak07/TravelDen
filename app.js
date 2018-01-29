var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    passport   = require("passport"),
    LocalStrategy = require("passport-local"),
    flash      = require("connect-flash"),
    User       = require("./models/user"),
    Campground = require("./models/campground"),
    moment     = require("moment"),
    Comment    = require("./models/comments"),
    seedDB     = require("./seeds"),
    methodOverride = require("method-override");

//requiring routes    
var commentsRoutes   = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");
 
var url = process.env.databaseURL || "mongodb://localhost/yelp_camp_v2";
mongoose.connect(url,{useMongoClient: true});




app.use(bodyParser.urlencoded({extented: true}));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(flash());
//seed removed
//seedDB();

//passport config

app.use(require("express-session")({
   secret: "The beauty of Mathematics is overwhelming",
   resave: false,
   saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({extented: true}));

app.set("view engine","ejs");

//middleware to pass username to all templates
app.use(function(req,res, next){
   res.locals.currentUser = req.user; //req.user contails all basic info of user who is logged in
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.get('*',function(req,res,next){
  if(req.headers['x-forwarded-proto']!='https')
    res.redirect('https://aqueous-brook-22521.herokuapp.com'+req.url);
  else
    next(); /* Continue to other routes if we're not redirecting */
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments/",commentsRoutes);


//listen to the c9 server
app.listen(process.env.PORT, process.env.IP,function(){
    console.log("Yelp Camp Server is Running");
}); 