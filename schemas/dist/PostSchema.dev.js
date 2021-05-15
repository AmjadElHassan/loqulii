"use strict";

var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var PostSchema = new Schema({
  content: {
    type: String,
    trim: true
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  retweetUsers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  retweetData: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  pinned: Boolean
}, {
  timestamps: true
});
var Post = mongoose.model("Post", PostSchema);
module.exports = Post;