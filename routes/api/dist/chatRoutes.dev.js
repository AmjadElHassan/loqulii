"use strict";

var express = require('express');

var app = express();
var router = express.Router();

var bodyParser = require('body-parser');

var Post = require('../../schemas/PostSchema.js');

var User = require('../../schemas/UserSchema.js');

var Chat = require('../../schemas/ChatSchema.js');

var bcrypt = require("bcrypt");

var session = require('express-session');

var multer = require('multer');

var upload = multer({
  dest: "uploads/"
});

var path = require("path");

var fs = require('fs');

app.use(bodyParser.urlencoded({
  extended: false
}));
router.get('/', function _callee(req, res, next) {
  var results;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Chat.find({
            users: {
              $elemMatch: //return the elements of an array that match the following condition
              {
                $eq: req.session.user._id
              } //where any value within that element is equal to: our user id

            }
          }).populate("users").sort({
            updatedAt: "desc"
          }));

        case 3:
          results = _context.sent;
          res.status(200).send(results);
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.log("cannot retrieve Chats from Db: " + _context.t0);
          res.sendStatus(400);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
router.get('/:chatId', function _callee2(req, res, next) {
  var results;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          console.log(req.params.chatId);
          _context2.next = 4;
          return regeneratorRuntime.awrap(Chat.findOne({
            _id: req.params.chatId,
            users: {
              $elemMatch: //return the elements of an array that match the following condition
              {
                $eq: req.session.user._id
              } //where any value within that element is equal to: our user id

            }
          }).populate("users").sort({
            updatedAt: "desc"
          }));

        case 4:
          results = _context2.sent;
          res.status(200).send(results);
          _context2.next = 12;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          console.log("cannot retrieve Chats from Db: " + _context2.t0);
          res.sendStatus(400);

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
router.post('/', function _callee3(req, res, next) {
  var chatMembers, chatData, newChat;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;

          if (req.body.users) {
            _context3.next = 4;
            break;
          }

          console.log('no request body received');
          return _context3.abrupt("return", res.sendStatus(400));

        case 4:
          _context3.next = 6;
          return regeneratorRuntime.awrap(JSON.parse(req.body.users));

        case 6:
          chatMembers = _context3.sent;
          _context3.next = 9;
          return regeneratorRuntime.awrap(chatMembers.push(req.session.user));

        case 9:
          chatData = {
            isGroupChat: true,
            users: chatMembers
          };
          _context3.next = 12;
          return regeneratorRuntime.awrap(Chat.create(chatData));

        case 12:
          newChat = _context3.sent;
          res.status(200).send(newChat);
          _context3.next = 20;
          break;

        case 16:
          _context3.prev = 16;
          _context3.t0 = _context3["catch"](0);
          console.log("server Error: " + _context3.t0);
          res.sendStatus(400);

        case 20:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 16]]);
});
router.post('/messages/:id', function _callee4(req, res, next) {
  var chatMembers;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          chatMembers = req.body;
          res.status(200).send(chatMembers[0]);

        case 2:
        case "end":
          return _context4.stop();
      }
    }
  });
});
router.put('/:chatId', function _callee5(req, res, next) {
  var chatNameUpdate;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Chat.findByIdAndUpdate(req.params.chatId, req.body));

        case 3:
          chatNameUpdate = _context5.sent;
          _context5.next = 6;
          return regeneratorRuntime.awrap(res.sendStatus(204));

        case 6:
          _context5.next = 12;
          break;

        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](0);
          console.log(_context5.t0);
          res.sendStatus(400);

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
module.exports = router;