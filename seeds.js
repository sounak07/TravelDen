var mongoose   = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comments");


var data = [
    {
         name: "Nainital", 
         image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1050&q=60&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
         description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod empor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
     {
         name: "Darjeeling", 
         image: "https://images.unsplash.com/photo-1475483768296-6163e08872a1?auto=format&fit=crop&w=1050&q=80",
         description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod empor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
     {
         name: "Alps", 
         image: "https://images.unsplash.com/photo-1496545672447-f699b503d270?auto=format&fit=crop&w=1051&q=80",
         description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod empor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }
];

function seedDB(){
    //Remove all Campgrounds
    Campground.remove({}, function(err){
    if(err){
        console.log(err);
    }else{
        console.log("Campgrounds Removed");
        //add few campgrounds
        data.forEach(function(seed){
        Campground.create(seed, function(err, campground){
          if(err){
              console.log(err);
          } else{
              console.log("added a Campground");
              //add a comment
              Comment.create(
                     { 
                        text : "this place is awesome-ish",
                        author: "Potato Head"
                     }, function(err, comment){
                         if(err){
                             console.log(err);
                         }else{
                             campground.comments.push(comment);
                             campground.save();
                             console.log("Create new Comment")
                         }
                     });
          }    
        });
     });
  }
 });
 
}

module.exports = seedDB;