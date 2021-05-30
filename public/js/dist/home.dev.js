"use strict";

// const Post = require("../../schemas/PostSchema")
// const { create } = require("../../schemas/PostSchema")
$(document).ready(function () {
  $.get("/api/posts", {
    followingOnly: false
  }, function _callee(response) {
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            outputPosts(response, $(".postsContainer"));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    });
  });
});