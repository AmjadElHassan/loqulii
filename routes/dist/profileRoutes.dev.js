"use strict";

var express = require('express');

var app = express();
var router = express.Router();

var bodyParser = require('body-parser');

var User = require('../schemas/UserSchema');

var bcrypt = require("bcrypt");

var session = require('express-session');

router.get('/:username', function _callee(req, res, next) {
  var payLoad;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (req.session.user) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", res.status(200).redirect("/"));

        case 2:
          _context.next = 4;
          return regeneratorRuntime.awrap(getPayload(req.params.username, req.session.user));

        case 4:
          payLoad = _context.sent;
          res.status(200).render("profilePage", payLoad);

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
});
router.get('/:username/replies', function _callee2(req, res, next) {
  var payLoad;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (req.session.user) {
            _context2.next = 2;
            break;
          }

          return _context2.abrupt("return", res.status(200).redirect("/"));

        case 2:
          _context2.next = 4;
          return regeneratorRuntime.awrap(getPayload(req.params.username, req.session.user));

        case 4:
          payLoad = _context2.sent;
          payLoad.selectedTab = "replies";
          res.status(200).render("profilePage", payLoad);

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
});
router.get('/:username/following', function _callee3(req, res, next) {
  var payLoad;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (req.session.user) {
            _context3.next = 2;
            break;
          }

          return _context3.abrupt("return", res.status(200).redirect("/"));

        case 2:
          _context3.next = 4;
          return regeneratorRuntime.awrap(getPayload(req.params.username, req.session.user));

        case 4:
          payLoad = _context3.sent;
          payLoad.selectedTab = "following";
          res.status(200).render("followPage", payLoad);

        case 7:
        case "end":
          return _context3.stop();
      }
    }
  });
});
router.get('/:username/followers', function _callee4(req, res, next) {
  var payLoad;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (req.session.user) {
            _context4.next = 2;
            break;
          }

          return _context4.abrupt("return", res.status(200).redirect("/"));

        case 2:
          _context4.next = 4;
          return regeneratorRuntime.awrap(getPayload(req.params.username, req.session.user));

        case 4:
          payLoad = _context4.sent;
          payLoad.selectedTab = "followers";
          res.status(200).render("followPage", payLoad);

        case 7:
        case "end":
          return _context4.stop();
      }
    }
  });
});

function getPayload(username, userLoggedIn) {
  var user;
  return regeneratorRuntime.async(function getPayload$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            username: username
          }));

        case 3:
          user = _context5.sent;

          if (user) {
            _context5.next = 11;
            break;
          }

          _context5.next = 7;
          return regeneratorRuntime.awrap(User.findById(username));

        case 7:
          user = _context5.sent;

          if (user) {
            _context5.next = 11;
            break;
          }

          console.log('wtf');
          return _context5.abrupt("return", {
            pageTitle: "User Not Found",
            userLoggedIn: userLoggedIn,
            userLoggedInJs: JSON.stringify(userLoggedIn)
          });

        case 11:
          console.log(user);
          return _context5.abrupt("return", {
            pageTitle: user.username,
            userLoggedIn: userLoggedIn,
            userLoggedInJs: JSON.stringify(userLoggedIn),
            profileUser: user
          });

        case 15:
          _context5.prev = 15;
          _context5.t0 = _context5["catch"](0);
          console.log(_context5.t0);

        case 18:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 15]]);
}

module.exports = router;