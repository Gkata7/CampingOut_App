var express = require("express");
var router = express.Router({mergeParams: true });
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// ============= New Comments ===============
router.get("/new", middleware.isLoggedIn, function(req,res){
  Campground.findById(req.params.id, function(err,campground){
    if(err){
      console.log(err);
    }else{
      res.render("comments/new", {campground: campground});
    }
  })
});

// ======== Comments Created ==========
router.post("/", middleware.isLoggedIn, function(req,res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
      res.redirect("/campgrounds")
    } else{
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          req.flash("error", "Something Isn't Quite Right!");
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          req.flash("success", "Successfully Added Comment!");
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  })
});

// ======= Editing Comments ===========
router.get("/:comment_id/edit", middleware.checkComment, function(req,res){
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err || ! foundCampground){
      req.flash("error", "Campground Does Not Exist!");
      return res.redirect("back");
    }
    Comment.findById(req.params.comment_id, function(err,foundComment){
      if(err){
        res.redirect("back");
      } else {
        res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
      }
    });
  });
});

// ========== Updating Comments ==========
router.put("/:comment_id", middleware.checkComment, function(req,res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updateComments){
    if(err){
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// ======= Delete Route ============
router.delete("/:comment_id", middleware.checkComment, function(req,res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  })
});

module.exports = router;
