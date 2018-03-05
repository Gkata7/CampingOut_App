var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");
var Comment = require("./models/comment");

var data = [
  { name: "Happy Feet",
    image: "http://haileyidaho.com/wp-content/uploads/2015/01/Stanley-lake-camping-Credit-Carol-Waller-2011.jpg",
    description: "Hello there this is long a description spellling does not matter or the words i just need to use space, blahh bahh idk"
  },
  { name: "Happy Feet",
    image: "http://haileyidaho.com/wp-content/uploads/2015/01/Stanley-lake-camping-Credit-Carol-Waller-2011.jpg",
    description: "Hello there"
  },
  { name: "Happy Feet",
    image: "http://haileyidaho.com/wp-content/uploads/2015/01/Stanley-lake-camping-Credit-Carol-Waller-2011.jpg",
    description: "Hello there"
  }
]

function seedDB(){
  Campground.remove({}, function(err){
    if(err){
      console.log(err);
    }
    console.log("removed campgrounds");
// add a few new campgrounds
    data.forEach(function(seed){
      Campground.create(seed,function(err,campground){
        if(err){
          console.log(err);
        }else {
          console.log("Added a campground");
          Comment.create(
            {
              text:"This place is awesome",
              author:"Homie",
            }, function(err, comment){
                if(err){
                  console.log(err);
                }else{
                campground.comments.push(comment);
                campground.save();
                console.log("created new comment");
              }
            }
          )
        }
      });
    });
  });
}

module.exports = seedDB;
