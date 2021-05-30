"use strict";

var express = require('express');

var app = express();
var router = express.Router();

var bodyParser = require('body-parser');

var User = require('../schemas/UserSchema');

var bcrypt = require("bcrypt");

var session = require('express-session');

router.get('/', function _callee(req, res, next) {
  var payLoad;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          //we configured the router to handle requests at root "/" 
          payLoad = {
            pageTitle: "Inbox",
            userLoggedIn: req.session.user,
            userLoggedInJs: JSON.stringify(userLoggedIn)
          };
          res.status(200).render("mailPage", payLoad);

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
});
router.get('/new', function _callee2(req, res, next) {
  var payLoad;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          //we configured the router to handle requests at root "/" 
          payLoad = {
            pageTitle: "New Message",
            userLoggedIn: req.session.user,
            userLoggedInJs: JSON.stringify(userLoggedIn)
          };
          res.status(200).render("newMessage", payLoad);

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
});
module.exports = router;