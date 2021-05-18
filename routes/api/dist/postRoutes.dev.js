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
  var postData, results;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(getPosts({
            _id: req.params.id
          }));

        case 3:
          postData = _context.sent;

          if (postData.length == 1) {
            postData = postData[0];
          }

          results = {
            postData: postData
          };

          if (postData.replyTo) {
            console.log('yes');
            results.replyTo = postData.replyTo;
          }

          _context.next = 9;
          return regeneratorRuntime.awrap(getPosts({
            replyTo: req.params.id
          }));

        case 9:
          results.replies = _context.sent;
          res.status(200).send(results);
          _context.next = 17;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          res.status(400);

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
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
          res.status(200).send(results);

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
          //we configured the router to handle requests at root "/" 
          console.log(req.body.content);
          postData = {
            content: req.body.content,
            postedBy: req.session.user,
            replyTo: req.body.replyTo
          };
          console.log(postData);
          _context3.prev = 3;
          _context3.next = 6;
          return regeneratorRuntime.awrap(Post.create(postData));

        case 6:
          newPost = _context3.sent;
          _context3.next = 9;
          return regeneratorRuntime.awrap(User.populate(newPost, {
            path: "postedBy"
          }));

        case 9:
          populatedNewPost = _context3.sent;
          _context3.next = 12;
          return regeneratorRuntime.awrap(Post.populate(newPost, {
            path: "replyTo"
          }));

        case 12:
          res.status(201).send(populatedNewPost);
          _context3.next = 19;
          break;

        case 15:
          _context3.prev = 15;
          _context3.t0 = _context3["catch"](3);
          console.log("asynchronous server response: ".concat(_context3.t0));
          return _context3.abrupt("return", res.sendStatus(400));

        case 19:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[3, 15]]);
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
router["delete"]('/:id', function _callee6(req, res, next) {
  var postId, post;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          postId = {
            _id: req.params.id
          };
          _context6.next = 4;
          return regeneratorRuntime.awrap(Post.findOneAndDelete(postId));

        case 4:
          post = _context6.sent;
          console.log(post);
          res.sendStatus(202);
          _context6.next = 13;
          break;

        case 9:
          _context6.prev = 9;
          _context6.t0 = _context6["catch"](0);
          console.log(_context6.t0);
          res.status(400);

        case 13:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 9]]);
});

function getPosts(searchObject) {
  var IdCheck, results;
  return regeneratorRuntime.async(function getPosts$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          IdCheck = searchObject !== undefined ? searchObject : null;
          _context7.next = 4;
          return regeneratorRuntime.awrap(Post.find(IdCheck).populate("postedBy").populate("retweetData").populate("replyTo").sort({
            "createdAt": -1
          }));

        case 4:
          results = _context7.sent;
          _context7.next = 7;
          return regeneratorRuntime.awrap(User.populate(results, {
            path: "replyTo.postedBy"
          }));

        case 7:
          results = _context7.sent;
          _context7.next = 10;
          return regeneratorRuntime.awrap(User.populate(results, {
            path: "retweetData.postedBy"
          }));

        case 10:
          return _context7.abrupt("return", _context7.sent);

        case 13:
          _context7.prev = 13;
          _context7.t0 = _context7["catch"](0);
          console.log(_context7.t0);

        case 16:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 13]]);
}

module.exports = router;