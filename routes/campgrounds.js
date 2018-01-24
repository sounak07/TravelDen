var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var request = require('request'); 
var moment     = require("moment");

//INDEX-shows the campgrounds in the page after submission
router.get("/", function(req, res){
    if(req.query.search){
        var regex = new RegExp(escapeRegex(req.query.search), 'gi');
         Campground.find({"name":regex}, function(err, allcamp){
        if(err){
            console.log(err);
        }else{
            //it is rendering the campgrounds page
            res.render("campgrounds/index",{campgrounds: allcamp});
        }
    });
    } else {
    //get campgrounds and render
    Campground.find({}, function(err, allcamp){
        if(err){
            console.log(err);
        }else{
            //it is rendering the campgrounds page
            res.render("campgrounds/index",{campgrounds: allcamp});
        }
    });
  }
});

//CREATE - add new campground
router.post("/",middleware.isLoggedIn, function(req, res){
    var name  = req.body.name;
    var image = req.body.image;
    var desc  = req.body.description;
    var price = req.body.price;
    var author={
        id:req.user._id,
        username:req.user.username
    };
     request('https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAxmf4ZmV-9KWjAKVA3v2disaI-np7BLM4&address=' + encodeURIComponent(req.body.address), function (err, response, body) {
    if (err){
      console.log('error!', err);
      res.redirect("back");
    } else {
    var data = JSON.parse(body);
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var address = data.results[0].formatted_address;
    var newCampground= {name: name, image: image, description:desc, author:author, price: price, address: address, lat: lat, lng: lng};
    //create a new campground
    Campground.create(newCampground, function(err, newcamp){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
   });
  }
 });
});

//its the form page to submit new campground
router.get("/new",middleware.isLoggedIn, function(req, res){
    //just render the form
    res.render("campgrounds/new");
});

//find the campground with an id to show the camp description
router.get("/:id",function(req, res){
    //find campground display 
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
        if(err||!foundCamp){
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");
        }else{
            // if(req.xhr){
            //     res.json(foundCamp);
            // }else{
                res.render("campgrounds/show",{campground: foundCamp,moment: moment});
            // }
        }
    });    
});

//edit campground
router.get("/:id/edit",middleware.checkCampOwnerShip, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
       if(err){
           res.redirect("/campgrounds");
       } else{
           res.render("campgrounds/edit",{campground: foundCampground});
       }
     });
});

//update campground
router.put("/:id", middleware.checkCampOwnerShip, function(req, res){
    var name  = req.body.name;
    var image = req.body.image;
    var desc  = req.body.description;
    var price = req.body.price;
    var author={
        id:req.user._id,
        username:req.user.username
    };
     request('https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAxmf4ZmV-9KWjAKVA3v2disaI-np7BLM4&address=' + encodeURIComponent(req.body.address), function (err, response, body) {
    if (err){
      console.log('error!', err);
      res.redirect("back");
    } else {
    var data = JSON.parse(body);
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var address = data.results[0].formatted_address;
    var updateCampground= { name: name, image: image, description:desc, author:author, price: price, address: address, lat: lat, lng: lng};
    //find and update
    Campground.findByIdAndUpdate(req.params.id,updateCampground, function(err, updatedcamp){
       if(err){
           res.redirect("/campgrounds");
       } else{
           res.redirect("/campgrounds/"+req.params.id);
       }
    });
  }
 });
});

//destroy campground 

router.delete("/:id",middleware.checkCampOwnerShip, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campgrounds");
      } else{
          res.redirect("/campgrounds");
      }
   });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;