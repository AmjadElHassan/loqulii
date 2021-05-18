"use strict";

$(document).ready(function () {
  $.get("/api/posts/".concat(postId), function _callee(response) {
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            outputPostsWithReplies(response, $(".postsContainer"));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    });
  });
});