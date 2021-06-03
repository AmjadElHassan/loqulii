"use strict";

var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var ChatSchema = new Schema({
  chatName: {
    type: String,
    trim: true
  },
  isGroupChat: {
    type: Boolean,
    "default": false
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  latestMessage: {
    type: Schema.Types.ObjectId,
    ref: 'Message'
  }
}, {
  timestamps: true
});
var Chat = mongoose.model("Chat", ChatSchema);
module.exports = Chat;