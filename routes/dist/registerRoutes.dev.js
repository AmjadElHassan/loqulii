"use strict";

var express = require('express');

var app = express();
var router = express.Router();

var bodyParser = require('body-parser');

var User = require('../schemas/UserSchema');

var bcrypt = require("bcrypt");

app.set("view engine", "pug");
app.set("views", "views");
app.use(bodyParser.urlencoded({
  extended: false
}));
router.get('/', function (req, res, next) {
  //we configured the router to handle requests at root "/" 
  res.status(200).render("register"); //to load the login interface
});
router.post('/', function _callee(req, res, next) {
  var firstName, lastName, username, email, password, payload, existingUser, newUser;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(req.body.firstName.trim());

        case 3:
          firstName = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(req.body.lastName.trim());

        case 6:
          lastName = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(req.body.username.trim());

        case 9:
          username = _context.sent;
          _context.next = 12;
          return regeneratorRuntime.awrap(req.body.email.trim());

        case 12:
          email = _context.sent;
          _context.next = 15;
          return regeneratorRuntime.awrap(req.body.password);

        case 15:
          password = _context.sent;
          _context.next = 18;
          return regeneratorRuntime.awrap(req.body);

        case 18:
          payload = _context.sent;
          console.log(payload);

          if (!(firstName && lastName && username && email && password)) {
            _context.next = 40;
            break;
          }

          _context.next = 23;
          return regeneratorRuntime.awrap(User.findOne({
            $or: [{
              username: username
            }, {
              email: email
            }]
          })["catch"](function (err) {
            payload.errorMessage = "Please provide only valid characters in each field";
            res.status(200).render("register", payload);
          }));

        case 23:
          existingUser = _context.sent;

          if (!(existingUser == null)) {
            _context.next = 38;
            break;
          }

          _context.next = 27;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 27:
          payload.password = _context.sent;
          _context.next = 30;
          return regeneratorRuntime.awrap(User.create(payload));

        case 30:
          newUser = _context.sent;
          console.log(newUser);
          req.session.user = newUser;
          console.log(req.session);
          console.log("New User created");
          res.redirect('/');
          _context.next = 40;
          break;

        case 38:
          //user found
          if (email == existingUser.email) {
            payload.errorMessage = "Email already In use.";
          } else {
            payload.errorMessage = "Username already In use.";
          }

          res.status(200).render("register", payload);

        case 40:
          _context.next = 45;
          break;

        case 42:
          _context.prev = 42;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);

        case 45:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 42]]);
});
module.exports = router;