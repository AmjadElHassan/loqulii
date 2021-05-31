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
router.post('/', function _callee2(req, res, next) {
  var chatMembers, chatData, newChat;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;

          if (req.body.users) {
            _context2.next = 4;
            break;
          }

          console.log('no request body received');
          return _context2.abrupt("return", res.sendStatus(400));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(JSON.parse(req.body.users));

        case 6:
          chatMembers = _context2.sent;
          _context2.next = 9;
          return regeneratorRuntime.awrap(chatMembers.push(req.session.user));

        case 9:
          chatData = {
            isGroupChat: true,
            users: chatMembers
          };
          _context2.next = 12;
          return regeneratorRuntime.awrap(Chat.create(chatData));

        case 12:
          newChat = _context2.sent;
          res.status(200).send(newChat);
          _context2.next = 20;
          break;

        case 16:
          _context2.prev = 16;
          _context2.t0 = _context2["catch"](0);
          console.log("server Error: " + _context2.t0);
          res.sendStatus(400);

        case 20:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 16]]);
});
router.post('/messages/:id', function _callee3(req, res, next) {
  var chatMembers;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          chatMembers = req.body;
          res.status(200).send(chatMembers[0]);

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  });
});
module.exports = router;