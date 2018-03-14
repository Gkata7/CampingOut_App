var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campgrounds");

// ======= Root Route ===========
router.get("/", function(req,res){
  res.render("landing");
});

// ========= Sign Up Route ===========
router.get("/register", function(req,res){
  res.render("register", {page: "register"});
});

// ========== Handles Sign Up =========
router.post("/register", function(req,res){
  var newUser = new User(
    {
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      avatar: req.body.avatar
    });
  User.register(newUser, req.body.password, function(err,user){
    if(err){
      return res.render("register", {"error": err.message});
    }
    passport.authenticate("local")(req,res,function(){
      req.flash("success", "Welcome To CampingOut " + user.username);
      res.redirect("/campgrounds");
    })
  })
});

// ======== Login form ========
router.get("/login", function(req,res){
  res.render("login", {page:"login"});
});

// ========= Handles Login Logic =========
router.post("/login", passport.authenticate("local",
  {
    successRedirect:"/campgrounds",
    failureRedirect: "/login",
    failureFlash: "Invalid Username or Password",
    successFlash: "Hello There!",
  }), function(req,res){
});

// ======== Logout Route=======
router.get("/logout", function(req,res){
  req.logout();
  req.flash("success", "You've Logged Out!");
  res.redirect("/campgrounds");
});

// ======== User Profile =========
router.get("/users/:id", function(req,res){
  User.findById(req.params.id, function(err, foundUser){
    if(err){
      req.flash("error", "Something Went Wrong");
      return res.redirect("/login");
    }
    Campground.find().where("author.id").equals(foundUser._id).exec(function(err,campgrounds){
      if(err){
        req.flash("error", "Something Went Wrong");
        return res.redirect("/login");
      }
      res.render("users/show", {user: foundUser, campgrounds: campgrounds});
    })
  });
});

module.exports = router;
