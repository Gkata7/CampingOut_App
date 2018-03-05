var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campgrounds"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/CampingOut");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

app.get("/", function(req,res){
  res.render("landing");
});
// Index Route - Show All Campgrounds
app.get("/campgrounds", function(req,res){
  Campground.find({}, function(err, campgrounds){
    if(err){
      console.log(err);
    } else {
      res.render("campgrounds/index", {campgrounds: campgrounds});
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
  res.render("campgrounds/new");
});
// Show - Shows detail about the campground
app.get("/campgrounds/:id", function(req,res){
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err){
      console.log(err);
    } else{
      console.log(foundCampground);
      res.render("campgrounds/show", {campground: foundCampground});
    }
  })
});

/// Comments Routes
app.get("/campgrounds/:id/comments/new", function(req,res){
  Campground.findById(req.params.id, function(err,campground){
    if(err){
      console.log(err);
    }else{
      res.render("comments/new", {campground: campground});
    }
  })
});

app.post("/campgrounds/:id/comments", function(req,res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
      res.redirect("/campgrounds")
    } else{
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  })
});


app.listen(3000, function(){
  console.log("Server Has Started");
})
