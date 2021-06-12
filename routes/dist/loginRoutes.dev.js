"use strict";

var express = require('express');

var app = express();
var router = express.Router();

var bodyParser = require('body-parser');

var User = require('../schemas/UserSchema');

var bcrypt = require("bcrypt");

var session = require('express-session');

app.set("view engine", "pug");
app.set("views", "views");
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(session({
  secret: process.env.SessionString,
  resave: true,
  saveUninitialized: false
}));
router.get('/', function (req, res, next) {
  //we configured the router to handle requests at root "/" 
  res.status(200).render("login"); //to load the login interface
});
router.post('/', function _callee(req, res, next) {
  var payload, username, password, user, passwordResult;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(req.body);

        case 2:
          payload = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(payload.logUsername.trim());

        case 5:
          username = _context.sent;
          password = payload.logPassword;

          if (!(username && password)) {
            _context.next = 22;
            break;
          }

          _context.next = 10;
          return regeneratorRuntime.awrap(User.findOne({
            username: req.body.logUsername
          })["catch"](function (err) {
            console.log(err);
            payload.errorMessage = "something went wrong";
            res.status(200).render("login", payload);
          }));

        case 10:
          user = _context.sent;

          if (!(user != null)) {
            _context.next = 20;
            break;
          }

          _context.next = 14;
          return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

        case 14:
          passwordResult = _context.sent;

          if (!(passwordResult === true)) {
            _context.next = 18;
            break;
          }

          req.session.user = user;
          return _context.abrupt("return", res.redirect('/'));

        case 18:
          payload.errorMessage = "Please re-enter pasword";
          return _context.abrupt("return", res.status(200).render("login", payload));

        case 20:
          payload.errorMessage = "User not found";
          return _context.abrupt("return", res.status(200).render("login", payload));

        case 22:
          payload.errorMessage = "Confirm each field contains only valid characters", res.status(200).render("login"); //to load the login interface

        case 23:
        case "end":
          return _context.stop();
      }
    }
  });
});
module.exports = router;