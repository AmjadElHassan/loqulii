"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express');

var app = express();
var router = express.Router();

var bodyParser = require('body-parser');

var Post = require('../../schemas/PostSchema.js');

var User = require('../../schemas/UserSchema.js');

var bcrypt = require("bcrypt");

var session = require('express-session');

app.use(bodyParser.urlencoded({
  extended: false
}));
router.put('/:userId/follow', function _callee(req, res, next) {
  var currentUser, user2FollowId, user2Follow, isFollowing, option;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          currentUser = req.session.user;

          if (currentUser) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.sendStatus(200).redirect('/'));

        case 4:
          user2FollowId = req.params.userId;
          _context.next = 7;
          return regeneratorRuntime.awrap(User.find({
            _id: user2FollowId
          }));

        case 7:
          user2Follow = _context.sent;

          if (user2Follow) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", res.sendStatus(404));

        case 10:
          if (!(user2Follow.length != 1)) {
            _context.next = 12;
            break;
          }

          return _context.abrupt("return", res.sendStatus(404).send('multiple users found'));

        case 12:
          user2Follow = user2Follow[0];
          isFollowing = user2Follow.followers !== undefined && user2Follow.followers.includes(currentUser._id);
          option = isFollowing ? "$pull" : "$addToSet";
          console.log(user2Follow, currentUser._id);
          _context.next = 18;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(currentUser._id, _defineProperty({}, option, {
            following: user2FollowId
          }), {
            "new": true
          }));

        case 18:
          req.session.user = _context.sent;
          _context.next = 21;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(user2FollowId, _defineProperty({}, option, {
            followers: currentUser._id
          }), {
            "new": true
          }));

        case 21:
          user2Follow = _context.sent;
          res.status(200).send(req.session.user);
          _context.next = 29;
          break;

        case 25:
          _context.prev = 25;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          res.status(404);

        case 29:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 25]]);
});
router.get('/:userId/followers', function _callee2(req, res, next) {
  var profileUser;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(User.findById(req.params.userId).populate("followers"));

        case 3:
          profileUser = _context2.sent;
          // let followerList = await User.populate(profileUser,{path: })
          res.status(202).send(profileUser);
          _context2.next = 11;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);
          res.status(400).send("Could not retrieve follower list");

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
router.get('/:userId/following', function _callee3(req, res, next) {
  var profileUser;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(User.findById(req.params.userId).populate("following"));

        case 3:
          profileUser = _context3.sent;
          // let followerList = await User.populate(profileUser,{path: })
          res.status(202).send(profileUser);
          _context3.next = 11;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);
          res.status(400).send("Could not retrieve follower list");

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
module.exports = router;