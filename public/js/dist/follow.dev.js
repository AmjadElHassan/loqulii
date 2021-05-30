"use strict";

$(document).ready(function _callee() {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log(profileUserId);
          _context.next = 3;
          return regeneratorRuntime.awrap(isFollowersTab());

        case 3:
          if (!_context.sent) {
            _context.next = 7;
            break;
          }

          loadFollowers();
          _context.next = 8;
          break;

        case 7:
          loadFollowing();

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
});

function isFollowersTab() {
  return regeneratorRuntime.async(function isFollowersTab$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!(selectedTab === "followers")) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", true);

        case 4:
          return _context2.abrupt("return", false);

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function loadFollowers(username) {
  return regeneratorRuntime.async(function loadFollowers$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          $.get("/api/users/".concat(profileUserId, "/followers"), function _callee2(response) {
            return regeneratorRuntime.async(function _callee2$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    outputUsers(response.followers, $(".resultsContainer"));

                  case 1:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          })["catch"](function (err) {
            console.log(err);
          });

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
}

function loadFollowing(username) {
  return regeneratorRuntime.async(function loadFollowing$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          $.get("/api/users/".concat(profileUserId, "/following"), function _callee3(response) {
            return regeneratorRuntime.async(function _callee3$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    outputUsers(response.following, $(".resultsContainer"));

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