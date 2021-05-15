"use strict";

// const Post = require("../../schemas/PostSchema")
// const { create } = require("../../schemas/PostSchema")
$(document).ready(function () {
  $.get("/api/posts", function _callee(response) {
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

function outputPosts(posts, container) {
  container.html("");

  if (!posts) {
    return container.append("<span class='no results'>No Results Found</span>");
  }

  posts.forEach(function (post) {
    var html = createPostHtml(post);
    container.append(html);
  });
}