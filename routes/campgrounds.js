var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");

// ======= Index Route - Show All Campgrounds =========
router.get("/", function(req,res){
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    } else {
      res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
    }
  });
});

// ========= Create Route - Create new Campgrounds ========
router.post("/", isLoggedIn, function(req,res){
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username,
  }
  var newCampground = {name: name, image: image, description: description, author: author};
  Campground.create(newCampground, function(err, newCreated){
    if(err){
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// ========= New - Create a new Campgrounds =========
router.get("/new", isLoggedIn, function(req,res){
  res.render("campgrounds/new");
});

// ========= Show - Shows detail about the campground ========
router.get("/:id", function(req,res){
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err){
      console.log(err);
    } else{
      console.log(foundCampground);
      res.render("campgrounds/show", {campground: foundCampground});
    }
  })
});

// ========= Edit Campground Route ===========
router.get("/:id/edit", checkCampground, function(req,res){
    Campground.findById(req.params.id, function(err,foundCampground){
      res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// ========= Update Campground Route ============
router.put("/:id", checkCampground, function(req,res){
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
    if(err){
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// ============= Delete Campground ==========
router.delete("/:id",checkCampground, function(req,res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// ======== Middleware =============
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
};
function checkCampground(req,res,next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err,foundCampground){
      if(err){
        res.redirect("back");
      } else {
        if(foundCampground.author.id.equals(req.user._id)){
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

module.exports = router;
