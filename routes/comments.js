var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comments");
var middleware = require("../middleware");

//comments new
router.get("/new", middleware.isLoggedIn, function(req, res){
    //find campground by id
    Campground.findById(req.params.id, function(err, camps){
        if(err){
            console.log(err);
        }else{
            if(req.xhr){
                res.json(camps);
            }else{
                res.render("comments/new",{campground: camps});    
          } 
        }
    });
     
});

//comments create
router.post("/",middleware.isLoggedIn, function(req, res){
   Campground.findById(req.params.id, function(err, campground){
      if(err){
          console.log(err);
          res.redirect("/campgrounds");
      } else{
          Comment.create(req.body.comment, function(err, comment){
              if(err){
                  req.flash("error", "Something went wrong");
                  console.log(err);
              }else{
                 if(req.xhr){
                  res.json(comment);
                }else{
                  //add username and id to comment
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  comment.author.picture = req.user.picture;
                  //save comment
                  comment.save();
                  campground.comments.push(comment);
                  campground.save();
                  req.flash("success", "Successfully added Comment");
                  res.redirect('/campgrounds/' + campground._id);
                }  
              }
          });
      }
   });
});

//edit route
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err,foundCampground){
       if(err||!foundCampground){
           req.flash("error", "Campground not found");
           return res.redirect("/campgrounds");
       }
       Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
            res.render("comments/edit",{campground_id: req.params.id, comment: foundComment});          
      }
   });
  });
});

//update comment route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updateComment){
       if(err){
           res.redirect("back");
       } else {
            res.redirect("/campgrounds/"+req.params.id);      
       }
   });
});

//delete route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       }else{
           req.flash("success", "Comment Deleted");
           res.redirect("/campgrounds/" + req.params.id);
       }
   }); 
});



module.exports = router;
