var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campgrounds"),
    seedDB = require("./seeds");

seedDB();
mongoose.connect("mongodb://localhost/CampingOut");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Campground.create(
//   {
//     name: "Half Moon Bay",
//     image: "https://www.visitnc.com/resimg.php/imgcrop/2/52908/image/800/448/KerrCamping.jpg",
//     description: "This is one of the top campsites, very nice view and very relaxing. I love it!"
// }, function(err,campground){
//     if(err){
//       console.log(err);
//     } else {
//       console.log("Created campground");
//       console.log(campground);
//     }
// });


app.get("/", function(req,res){
  res.render("landing");
});
// Index Route - Show All Campgrounds
app.get("/campgrounds", function(req,res){
  Campground.find({}, function(err, campgrounds){
    if(err){
      console.log(err);
    } else {
      res.render("index", {campgrounds: campgrounds});
    }
  })
});
// Create Route - Create new Campgrounds
app.post("/campgrounds", function(req,res){
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var newCampground = {name: name, image: image, description: description};
  Campground.create(newCampground, function(err, newCreated){
    if(err){
      console.log(err);
    } else {
      res.redirect("/campgrounds")
    }
  })
});
// New - Create a new Campgrounds
app.get("/campgrounds/new", function(req,res){
  res.render("new.ejs");
});
// Show - Shows detail about the campground
app.get("/campgrounds/:id", function(req,res){
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err){
      console.log(err);
    } else{
      res.render("show", {campground: foundCampground});
    }
  })
})


app.listen(3000, function(){
  console.log("Server Has Started");
})
