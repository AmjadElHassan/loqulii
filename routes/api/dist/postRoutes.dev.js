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
  var searchObj, isReply, onlyFollowingPosts, results;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          //we configured the router to handle requests at root "/" 
          searchObj = req.query;

          if (searchObj.isReply) {
            isReply = searchObj.isReply == "true";
            searchObj.replyTo = {
              $exists: isReply
            };
            delete searchObj.isReply;
          }

          if (searchObj.followingOnly) {
            onlyFollowingPosts = searchObj.followingOnly == 'true';

            if (onlyFollowingPosts) {
              searchObj.postedBy = req.session.user.following;
              searchObj.postedBy.push(req.session.user._id);
            }

            delete searchObj.followingOnly;
          }

          _context2.next = 5;
          return regeneratorRuntime.awrap(getPosts(searchObj));

        case 5:
          results = _context2.sent;
          res.status(200).send(results);

        case 7:
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
          postData = {
            content: req.body.content,
            postedBy: req.session.user,
            replyTo: req.body.replyTo
          };
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(Post.create(postData));

        case 4:
          newPost = _context3.sent;
          _context3.next = 7;
          return regeneratorRuntime.awrap(User.populate(newPost, {
            path: "postedBy"
          }));

        case 7:
          populatedNewPost = _context3.sent;
          _context3.next = 10;
          return regeneratorRuntime.awrap(Post.populate(newPost, {
            path: "replyTo"
          }));

        case 10:
          res.status(201).send(populatedNewPost);
          _context3.next = 17;
          break;

        case 13:
          _context3.prev = 13;
          _context3.t0 = _context3["catch"](1);
          console.log("asynchronous server response: ".concat(_context3.t0));
          return _context3.abrupt("return", res.sendStatus(400));

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 13]]);
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
router.put('/:id', function _callee5(req, res, next) {
  var newPin;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;

          if (!(req.body.pinned !== undefined)) {
            _context5.next = 4;
            break;
          }

          _context5.next = 4;
          return regeneratorRuntime.awrap(Post.updateMany({
            postedBy: req.session.user._id
          }, {
            pinned: false
          }));

        case 4:
          _context5.next = 6;
          return regeneratorRuntime.awrap(console.log(req.body.pinned, req.params.id));

        case 6:
          _context5.next = 8;
          return regeneratorRuntime.awrap(Post.findByIdAndUpdate(req.params.id, req.body, {
            "new": true
          }));

        case 8:
          newPin = _context5.sent;
          console.log(newPin);
          res.sendStatus(200);
          _context5.next = 17;
          break;

        case 13:
          _context5.prev = 13;
          _context5.t0 = _context5["catch"](0);
          console.log(_context5.t0);
          res.status(400).send('failed to pin');

        case 17:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 13]]);
});
router.post('/:id/retweets', function _callee6(req, res, next) {
  var postId, userId, deletedPost, option, repost, post;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          postId = req.params.id; //we receive the post information for the post being liked

          userId = req.session.user._id; //try and delete retweet

          _context6.next = 4;
          return regeneratorRuntime.awrap(Post.findOneAndDelete({
            postedBy: userId,
            retweetData: postId
          })["catch"](function (err) {
            console.log(err);
            res.status(400);
          }));

        case 4:
          deletedPost = _context6.sent;
          option = deletedPost != null ? "$pull" : "$addToSet";
          repost = deletedPost;

          if (!(repost == null)) {
            _context6.next = 11;
            break;
          }

          _context6.next = 10;
          return regeneratorRuntime.awrap(Post.create({
            postedBy: userId,
            retweetData: postId
          })["catch"](function (err) {
            console.log(err);
            res.status(400);
          }));

        case 10:
          repost = _context6.sent;

        case 11:
          _context6.next = 13;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(userId, _defineProperty({}, option, {
            retweets: repost._id
          }), {
            "new": true
          })["catch"](function (err) {
            console.log(err);
            res.sendStatus(400);
          }));

        case 13:
          req.session.user = _context6.sent;
          _context6.next = 16;
          return regeneratorRuntime.awrap(Post.findByIdAndUpdate(postId, _defineProperty({}, option, {
            retweetUsers: userId
          }), {
            "new": true
          })["catch"](function (err) {
            console.log(err);
            res.sendStatus(400);
          }));

        case 16:
          post = _context6.sent;
          res.status(200).send(post);

        case 18:
        case "end":
          return _context6.stop();
      }
    }
  });
});
router["delete"]('/:id', function _callee7(req, res, next) {
  var postId, post;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          postId = {
            _id: req.params.id
          };
          _context7.next = 4;
          return regeneratorRuntime.awrap(Post.findOneAndDelete(postId));

        case 4:
          post = _context7.sent;
          res.sendStatus(202);
          _context7.next = 12;
          break;

        case 8:
          _context7.prev = 8;
          _context7.t0 = _context7["catch"](0);
          console.log(_context7.t0);
          res.status(400);

        case 12:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 8]]);
});

function getPosts(searchObject) {
  var IdCheck, results;
  return regeneratorRuntime.async(function getPosts$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          IdCheck = searchObject !== undefined ? searchObject : null;
          _context8.next = 4;
          return regeneratorRuntime.awrap(Post.find(searchObject).populate("postedBy").populate("retweetData").populate("replyTo").sort({
            "createdAt": -1
          }));

        case 4:
          results = _context8.sent;
          _context8.next = 7;
          return regeneratorRuntime.awrap(User.populate(results, {
            path: "replyTo.postedBy"
          }));

        case 7:
          results = _context8.sent;
          _context8.next = 10;
          return regeneratorRuntime.awrap(User.populate(results, {
            path: "retweetData.postedBy"
          }));

        case 10:
          return _context8.abrupt("return", _context8.sent);

        case 13:
          _context8.prev = 13;
          _context8.t0 = _context8["catch"](0);
          console.log(_context8.t0);

        case 16:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 13]]);
}

module.exports = router;