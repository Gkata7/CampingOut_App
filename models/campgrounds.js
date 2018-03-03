var mongoose = require("mongoose");

var campgroundSchema = mongoose.Schema({
  name: {type: String},
  image: {type: String},
  description: {type: String}
});
module.exports = mongoose.model("campground", campgroundSchema);
