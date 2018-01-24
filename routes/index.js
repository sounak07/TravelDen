var express = require("express"),
    router  = express.Router(),
    User    = require("../models/user"),
    passport = require("passport"),
    Campground = require("../models/campground"),
    asyc      = require("async"),
    mailer     = require("nodemailer"),
    crypto      = require("crypto");


//root route
router.get("/", function(req, res){
    res.render("landing");
});

//show register page
router.get("/register", function(req, res){
    res.render("register");
});

//create new user
router.post("/register", function(req, res){
   var newUser = new User(
       {
           username:req.body.username,
           firstname:req.body.firstname,
           lastname:req.body.lastname,
           email:req.body.email,
           picture:req.body.picture
       });
   if(req.body.adminCode === "XErox08*"){
       newUser.isAdmin = true;
   }
   User.findOne({email:req.body.email},function(err,result){
      if(err){console.log(err);}
      if(result){
          req.flash("error","Email already exists!");
          res.redirect("/register");
      }else{
          User.register(newUser, req.body.password, function(err, user){
          if(err){
              return res.render("register",{error: err.message});
          } 
          passport.authenticate("local")(req, res, function(){
             req.flash("success", "Successfully Signed Up! Nice to meet you, " + user.firstname+"!");
             res.redirect("/campgrounds"); 
        });
     });
   }
 });
   
});


//show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

//login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login",
        failureFlash: true,
        successFlash: 'Hello again,Welcome to TravelDen!'
    }),function(req, res){
    
});

//logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out.Have a nice day:D");
   res.redirect("/campgrounds");
});

//User route
router.get("/users/:id", function(req,res){
   User.findById(req.params.id, function(err,foundUser){
      if(err){
          req.flash("error","Something went wrong");
          res.redirect("/campgrounds");
      } else{
          Campground.find().where("author.id").equals(foundUser._id).exec(function(err,campgrounds){
            if(err){
              req.flash("error","Something went wrong");
              res.redirect("/campgrounds");
            }else{
                res.render("users/show",{user:foundUser, campgrounds:campgrounds});
            }    
          });
          
      }
   }); 
});

//forgot password routes
router.get("/forgot", function(req, res){
    res.render("forgot");
});

router.post("/forgot", function(req,res){
   asyc.waterfall([
       function(done){
           crypto.randomBytes(20, function(err,buf){
              if(err){
                  console.log(err);
              } else{
                  var token = buf.toString('hex');
                  done(err,token);
              }
           });
       },
       function(token,done){
           User.findOne({email:req.body.email},function(err,user){
               if(err){console.log(err);}
               if(!user){
                   req.flash("error","No account with that email exists.Are you you trying to hack my website..?");
                   return res.redirect("/forgot");
               }
               
               user.resetPasswordToken = token;
               user.resetPasswordExpires = Date.now()+3600000; //1 hour 
               
               user.save(function(err){
                  done(err,token,user); 
               });
           });
       },
       function(token,user,done){
         var smptTransport = mailer.createTransport({
             service:"Gmail",
             auth:{
                 user:"sounakume@gmail.com",
                 pass:"prhqkmorzyvrcpph"
             }
         });
         var mailOptions={
           to:user.email,
           from:"smartrick08@gnail.com",
           subject:"Password Reset Mail",
           html:"You are receiving this e-mail because you have requested a password reset for <b>TravelDen's</b> user account <b>"+user.username+"</b>.<br><br>"+
                "Please click on the following link to complete the password reset process<br><br>"+
                "https://webcamp-sounak0807.c9users.io/reset/"+token+"<br><br>"+
                "If u didn't request this please ignore this mail and your password will remain unchanged<br><br>"+
                "<b>Note</b>: This mail has an expiry time of <b>1 hour</b><br><br><br>"+
                "Still in Doubt? Send your query to sounakume@gmail.com<br><br>"+
                "- <b>Sounak,Developer Banda :)</b>"
         };
         smptTransport.sendMail(mailOptions, function(err){
            if(err){console.log(err);}
            console.log("mail sent");
            req.flash("success", "An e-mail has been sent to "+ user.email +" with furthur instructions");
            done(err,"done");
         });
       }
    ], function(err){
        if(err) {return console.log(err);}
        res.redirect("/forgot");
    }); 
});

router.get("/reset/:token", function(req,res){
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now() } }, function(err,user){
       if(err){console.log(err)}
       if(!user){
           req.flash("error", "Password reset token is invalid or has expired.");
           res.redirect("/forgot");
       }else{
           res.render("reset",{token: req.params.token});
       }
    });
});

router.post("/reset/:token", function(req,res){
    asyc.waterfall([
        function(done){
          User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now() } }, function(err,user){
           if(err){console.log(err);}
           if(!user){
               req.flash("error", "Password reset token is invalid or has expired.");
               res.redirect("/forgot");
           } else {
             if(req.body.password===req.body.confirm){
               user.setPassword(req.body.password, function(err){
                   if(err){console.log(err);}
                   user.resetPasswordToken   = undefined;
                   user.resetPasswordExpires = undefined;
                   
                   user.save(function(err){
                       if(err){console.log(err);}
                       req.logIn(user,function(err){
                           done(err,user);
                       });
                  });
               });
           } else {
               req.flash("error", "Passwords don't match.");
               res.redirect("back");
           }
       }
    });  
   },
   function(user,done){
       var smptTransport = mailer.createTransport({
             service:"Gmail",
             auth:{
                 user:"sounakume@gmail.com",
                 pass:"prhqkmorzyvrcpph"
             }
         });
         var mailOptions={
           to:user.email,
           from:"sounakume@gmail.com",
           subject:"Confimation Mail on Password Update",
           html:"You are receiving this e-mail as a confirmation that your password of <b>TravelDen's</b> user account <b>"+user.username+"</b> has been updated successfully.<br><br>"+
                "If u didn't request this please report to the author.<br><br"+
                "Still in Doubt? Send your query to sounakume@gmail.com<br><br>"+
                "- <b>Sounak,Developer Banda :)</b>"
         };
         smptTransport.sendMail(mailOptions, function(err){
            if(err){console.log(err);}
            console.log("mail sent");
            req.flash("success", "Successfully updated your password, check mail for details");
            done(err,"done");
         });
   }
    
    ],function(err){
        if(err){console.log(err);}
        res.redirect("/campgrounds");
    });
});

module.exports = router;
