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
router.get('/:id', function _callee(req, res, next) {
  var results;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(getPosts(req.params.id));

        case 3:
          results = _context.sent;
          res.status(200).send(results[0]);
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          res.status(400);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
router.get('/', function _callee2(req, res, next) {
  var results;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(getPosts());

        case 2:
          results = _context2.sent;
          res.status(200).send(results); // try {
          //     let response = await Post.find().populate("postedBy")
          //     .populate("retweetData")
          //     .sort({ "createdAt": -1 })
          //     await User.populate(response, {path: "retweetData.postedBy"})
          //     res.status(200).send(response)
          // }
          // catch (err) {
          //     console.log(err)
          //     res.sendStatus(400)
          // }

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
});
router.post('/', function _callee3(req, res, next) {
  var postData, newPost, populatedNewPost;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (!req.body.replyTo) {
            _context3.next = 2;
            break;
          }

          return _context3.abrupt("return", console.log(req.body.replyTo));

        case 2:
          if (req.body.content) {
            _context3.next = 5;
            break;
          }

          console.log("content param of request not received");
          return _context3.abrupt("return", res.sendStatus(400));

        case 5:
          postData = {
            content: req.body.content,
            postedBy: req.session.user
          };
          _context3.prev = 6;
          _context3.next = 9;
          return regeneratorRuntime.awrap(Post.create(postData));

        case 9:
          newPost = _context3.sent;
          _context3.next = 12;
          return regeneratorRuntime.awrap(User.populate(newPost, {
            path: "postedBy"
          }));

        case 12:
          populatedNewPost = _context3.sent;
          res.status(201).send(populatedNewPost);
          _context3.next = 20;
          break;

        case 16:
          _context3.prev = 16;
          _context3.t0 = _context3["catch"](6);
          console.log("asynchronous server response: ".concat(_context3.t0));
          return _context3.abrupt("return", res.sendStatus(400));

        case 20:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[6, 16]]);
});
router.put('/:id/like', function _callee4(req, res, next) {
  var postId, userId, isLiked, option, post;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          postId = req.params.id; //we receive the post information for the post being liked

          userId = req.session.user._id;
          isLiked = req.session.user.likes && req.session.user.likes.includes(postId);
          option = isLiked ? "$pull" : "$addToSet"; //insert user like

          _context4.next = 6;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(userId, _defineProperty({}, option, {
            likes: postId
          }), {
            "new": true
          })["catch"](function (err) {
            console.log(err);
            res.sendStatus(400);
          }));

        case 6:
          req.session.user = _context4.sent;
          _context4.next = 9;
          return regeneratorRuntime.awrap(Post.findByIdAndUpdate(postId, _defineProperty({}, option, {
            likes: userId
          }), {
            "new": true
          }));

        case 9:
          post = _context4.sent;
          res.status(200).send(post);

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  });
});
router.post('/:id/retweets', function _callee5(req, res, next) {
  var postId, userId, deletedPost, option, repost, post;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          postId = req.params.id; //we receive the post information for the post being liked

          userId = req.session.user._id; //try and delete retweet

          _context5.next = 4;
          return regeneratorRuntime.awrap(Post.findOneAndDelete({
            postedBy: userId,
            retweetData: postId
          })["catch"](function (err) {
            console.log(err);
            res.status(400);
          }));

        case 4:
          deletedPost = _context5.sent;
          option = deletedPost != null ? "$pull" : "$addToSet";
          repost = deletedPost;

          if (!(repost == null)) {
            _context5.next = 11;
            break;
          }

          _context5.next = 10;
          return regeneratorRuntime.awrap(Post.create({
            postedBy: userId,
            retweetData: postId
          })["catch"](function (err) {
            console.log(err);
            res.status(400);
          }));

        case 10:
          repost = _context5.sent;

        case 11:
          _context5.next = 13;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(userId, _defineProperty({}, option, {
            retweets: repost._id
          }), {
            "new": true
          })["catch"](function (err) {
            console.log(err);
            res.sendStatus(400);
          }));

        case 13:
          req.session.user = _context5.sent;
          _context5.next = 16;
          return regeneratorRuntime.awrap(Post.findByIdAndUpdate(postId, _defineProperty({}, option, {
            retweetUsers: userId
          }), {
            "new": true
          })["catch"](function (err) {
            console.log(err);
            res.sendStatus(400);
          }));

        case 16:
          post = _context5.sent;
          res.status(200).send(post);

        case 18:
        case "end":
          return _context5.stop();
      }
    }
  });
});

function getPosts(Id) {
  var IdCheck, results;
  return regeneratorRuntime.async(function getPosts$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          IdCheck = Id !== undefined ? {
            _id: Id
          } : null;
          console.log(IdCheck);
          _context6.next = 5;
          return regeneratorRuntime.awrap(Post.find(IdCheck).populate("postedBy").populate("retweetData").sort({
            "createdAt": -1
          }));

        case 5:
          results = _context6.sent;
          _context6.next = 8;
          return regeneratorRuntime.awrap(User.populate(results, {
            path: "retweetData.postedBy"
          }));

        case 8:
          return _context6.abrupt("return", _context6.sent);

        case 11:
          _context6.prev = 11;
          _context6.t0 = _context6["catch"](0);
          console.log(_context6.t0);

        case 14:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 11]]);
}

module.exports = router;