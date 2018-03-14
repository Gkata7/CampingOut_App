var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");
var middleware = require("../middleware");
var NodeGeocoder = require("node-geocoder");
// var lint = require('ejs-lint');
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
var geocoder = NodeGeocoder(options);

// ======= Index Route - Show All Campgrounds =========
router.get("/", function(req,res){
  var perPage = 8;
  var pageQuery = parseInt(req.query.page);
  var pageNumber = pageQuery ? pageQuery : 1;
  var noMatch = null;
  if(req.query.search){
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
  /// Find all campgrounds
    Campground.find({name: regex}.skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err, allCampgrounds){
      if(err){
        console.log(err);
      } else {
        if(allCampgrounds.length < 1){
          noMatch = "No Campgrounds Match That Search.";
        }
          res.render("campgrounds/index", {
            campgrounds: allCampgrounds,
            current: pageNumber,
            pages: Math.ceil(count / perPage),
            noMatch: noMatch,
            search: req.query.search,
        });
      }
    }));
  } else {
  //// Find all campgrounds
      Campground.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err, allCampgrounds){
        Campground.count().exec(function(err, count){
        if(err){
          console.log(err);
        } else {
          res.render("campgrounds/index", {
            campgrounds: allCampgrounds,
            current: pageNumber,
            pages: Math.ceil(count / perPage),
            noMatch: noMatch,
            search: false,
          });
        };
      });
    });
  }
});

// ========= Create Route - Create new Campgrounds ========
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var price = req.body.price;
  var description = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      console.log(err);
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newCampground = {name: name, image: image, description: description, author:author, price: price, location: location, lat: lat, lng: lng = lng};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
      if(err){
        console.log(err);
      } else {
      //redirect back to campgrounds page
        console.log(newlyCreated);
        res.redirect("/campgrounds");
      }
    });
  });
});

// ========= New - Create a new Campgrounds =========
router.get("/new", middleware.isLoggedIn, function(req,res){
  res.render("campgrounds/new");
});

// ========= Show - Shows detail about the campground ========
router.get("/:id", function(req,res){
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err || !foundCampground){
      req.flash("error", "Campground Not Found");
      res.redirect("back");
    } else{
      console.log(foundCampground);
      res.render("campgrounds/show", {campground: foundCampground});
    }
  })
});

// ========= Edit Campground Route ===========
router.get("/:id/edit", middleware.checkCampground, function(req,res){
    Campground.findById(req.params.id, function(err,foundCampground){
      res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// ========= Update Campground Route ============
router.put("/:id", middleware.checkCampground, function(req,res){
    geocoder.geocode(req.body.location, function (err, data) {
      if (err || !data.length) {
        req.flash('error', 'Invalid address');
        return res.redirect('back');
      }
      var lat = data[0].latitude;
      var lng = data[0].longitude;
      var location = data[0].formattedAddress;
      var newData = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price, location: location, lat: lat, lng: lng = lng};
      Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, updatedCampground){
      if(err){
        req.flash("error", err.message);
        res.redirect("back");
      } else {
        req.flash("success", "Successfully Updated Campground");
        res.redirect("/campgrounds/" + req.params.id);
      }
    });
  });
});

// ============= Delete Campground ==========
router.delete("/:id", middleware.checkCampground, function(req,res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
