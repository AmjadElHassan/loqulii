"use strict";

var timer;
$("#searchBox").keydown(function _callee2(event) {
  var textbox, value, searchType;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          clearTimeout(timer);
          textbox = $(event.target);
          _context2.next = 4;
          return regeneratorRuntime.awrap(textbox.val());

        case 4:
          value = _context2.sent;
          _context2.next = 7;
          return regeneratorRuntime.awrap(textbox.data().search);

        case 7:
          searchType = _context2.sent;
          //relates to the data-search attr we added to the search box that is equal to the selectedTab, ie. posts or users
          timer = setTimeout(function _callee() {
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    value = textbox.val().trim();

                    if (!(value == "")) {
                      _context.next = 5;
                      break;
                    }

                    return _context.abrupt("return", $(".resultsContainer").html(""));

                  case 5:
                    search(value, searchType);

                  case 6:
                  case "end":
                    return _context.stop();
                }
              }
            });
          }, 1000);

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  });
});

function search(searchTerm, searchType) {
  var url = searchType == "posts" ? "/api/posts" : "/api/users";
  $.get(url, {
    search: searchTerm
  }, function _callee3(response) {
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (searchType == "users") {
              outputUsers(response, $(".resultsContainer"));
            } else {
              outputPosts(response, $(".resultsContainer"));
            }

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    });
  })["catch"](function (err) {
    console.log(err);
  });
}