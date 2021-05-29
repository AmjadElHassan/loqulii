"use strict";

$(document).ready(function _callee() {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(isReply());

        case 2:
          if (!_context.sent) {
            _context.next = 6;
            break;
          }

          loadreplies();
          _context.next = 7;
          break;

        case 6:
          loadPosts();

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
});

function loadPosts(username) {
  return regeneratorRuntime.async(function loadPosts$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          $.get("/api/posts", {
            postedBy: profileUserId,
            pinned: true
          }, function _callee2(response) {
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    outputPinnedPosts(response, $(".pinnedContainer"));

                  case 1:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          })["catch"](function (err) {
            console.log(err);
          });
          $.get("/api/posts", {
            postedBy: profileUserId,
            isReply: false
          }, function _callee3(response) {
            return regeneratorRuntime.async(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    outputPosts(response, $(".postsContainer"));

                  case 1:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          })["catch"](function (err) {
            console.log(err);
          });

        case 2:
        case "end":
          return _context4.stop();
      }
    }
  });
}

function loadreplies(username) {
  return regeneratorRuntime.async(function loadreplies$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          $.get("/api/posts", {
            postedBy: profileUserId,
            isReply: true
          }, function _callee4(response) {
            return regeneratorRuntime.async(function _callee4$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    outputPosts(response, $(".postsContainer"));

                  case 1:
                  case "end":
                    return _context5.stop();
                }
              }
            });
          })["catch"](function (err) {
            console.log(err);
          });

        case 1:
        case "end":
          return _context6.stop();
      }
    }
  });
}

function isReply() {
  return regeneratorRuntime.async(function isReply$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          if (!(selectedTab === "replies")) {
            _context7.next = 4;
            break;
          }

          return _context7.abrupt("return", true);

        case 4:
          return _context7.abrupt("return", false);

        case 5:
        case "end":
          return _context7.stop();
      }
    }
  });
}

function outputPinnedPosts(posts, container) {
  container.html("");

  if (posts.length == 0) {
    return container.hide();
  }

  posts.forEach(function (post) {
    var html = createPostHtml(post);
    container.append(html);
  });
}