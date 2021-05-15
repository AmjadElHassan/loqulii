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
router.get('/', function _callee(req, res, next) {
  var response;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Post.find().populate("postedBy").sort({
            "createdAt": -1
          }));

        case 3:
          response = _context.sent;
          res.status(200).send(response);
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          res.sendStatus(400);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
router.post('/', function _callee2(req, res, next) {
  var postData, newPost, populatedNewPost;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (req.body.content) {
            _context2.next = 3;
            break;
          }

          console.log("content param of request not received");
          return _context2.abrupt("return", res.sendStatus(400));

        case 3:
          postData = {
            content: req.body.content,
            postedBy: req.session.user
          };
          _context2.prev = 4;
          _context2.next = 7;
          return regeneratorRuntime.awrap(Post.create(postData));

        case 7:
          newPost = _context2.sent;
          _context2.next = 10;
          return regeneratorRuntime.awrap(User.populate(newPost, {
            path: "postedBy"
          }));

        case 10:
          populatedNewPost = _context2.sent;
          res.status(201).send(populatedNewPost);
          _context2.next = 18;
          break;

        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](4);
          console.log("asynchronous server response: ".concat(_context2.t0));
          return _context2.abrupt("return", res.sendStatus(400));

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[4, 14]]);
});
router.put('/:id/like', function _callee3(req, res, next) {
  var postId, userId, isLiked, option, post;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          postId = req.params.id; //we receive the post information for the post being liked

          userId = req.session.user._id;
          isLiked = req.session.user.likes && req.session.user.likes.includes(postId);
          option = isLiked ? "$pull" : "$addToSet"; //insert user like

          _context3.next = 6;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(userId, _defineProperty({}, option, {
            likes: postId
          }), {
            "new": true
          })["catch"](function (err) {
            console.log(err);
            res.sendStatus(400);
          }));

        case 6:
          req.session.user = _context3.sent;
          _context3.next = 9;
          return regeneratorRuntime.awrap(Post.findByIdAndUpdate(postId, _defineProperty({}, option, {
            likes: userId
          }), {
            "new": true
          }));

        case 9:
          post = _context3.sent;
          res.status(200).send(post);

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  });
});
router.post('/:id/retweets', function _callee4(req, res, next) {
  var postId, userId, deletedPost, option, repost, post;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          postId = req.params.id; //we receive the post information for the post being liked

          userId = req.session.user._id; //try and delete retweet

          _context4.next = 4;
          return regeneratorRuntime.awrap(Post.findOneAndDelete({
            postedBy: userId,
            retweetData: postId
          })["catch"](function (err) {
            console.log(err);
            res.status(400);
          }));

        case 4:
          deletedPost = _context4.sent;
          option = deletedPost != null ? "$pull" : "$addToSet";
          repost = deletedPost;

          if (!(repost == null)) {
            _context4.next = 11;
            break;
          }

          _context4.next = 10;
          return regeneratorRuntime.awrap(Post.create({
            postedBy: userId,
            retweetData: postId
          })["catch"](function (err) {
            console.log(err);
            res.status(400);
          }));

        case 10:
          repost = _context4.sent;

        case 11:
          _context4.next = 13;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(userId, _defineProperty({}, option, {
            retweets: repost._id
          }), {
            "new": true
          })["catch"](function (err) {
            console.log(err);
            res.sendStatus(400);
          }));

        case 13:
          req.session.user = _context4.sent;
          _context4.next = 16;
          return regeneratorRuntime.awrap(Post.findByIdAndUpdate(postId, _defineProperty({}, option, {
            retweetUsers: userId
          }), {
            "new": true
          })["catch"](function (err) {
            console.log(err);
            res.sendStatus(400);
          }));

        case 16:
          post = _context4.sent;
          res.status(200).send(post); // res.status(200).send(postId)
          // let option = isLiked ? "$pull" : "$addToSet"
          // //insert user like
          // req.session.user = await User.findByIdAndUpdate(userId, { [option]: { likes: postId } }, {new: true})
          // .catch((err)=>{console.log(err)
          // res.sendStatus(400)})
          // //insert post like
          // let post = await Post.findByIdAndUpdate(postId, { [option]: { likes: userId } },{new:true})
          // res.status(200).send(post)

        case 18:
        case "end":
          return _context4.stop();
      }
    }
  });
});
module.exports = router;