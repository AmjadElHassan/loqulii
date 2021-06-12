"use strict";

var express = require('express');

var app = express();
var router = express.Router();

var bodyParser = require('body-parser');

var Post = require('../../schemas/PostSchema.js');

var User = require('../../schemas/UserSchema.js');

var Chat = require('../../schemas/ChatSchema.js');

var Message = require('../../schemas/MessageSchema.js');

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
          }).populate("users").populate("latestMessage").sort({
            updatedAt: "desc"
          }));

        case 3:
          results = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(User.populate(results, {
            path: "latestMessage.sender"
          }));

        case 6:
          results = _context.sent;
          res.status(200).send(results);
          _context.next = 14;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          console.log("cannot retrieve Chats from Db: " + _context.t0);
          res.sendStatus(400);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
router.post('/', function _callee2(req, res, next) {
  var newMessage, latest, metaLatest, newChatMessage;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;

          if (!req.body.content || !req.body.chatId) {
            console.log('bad request');
            res.sendStatus(400);
          }

          newMessage = {
            sender: req.session.user._id,
            content: req.body.content,
            chat: req.body.chatId
          };
          _context2.next = 5;
          return regeneratorRuntime.awrap(Message.create(newMessage));

        case 5:
          latest = _context2.sent;
          _context2.next = 8;
          return regeneratorRuntime.awrap(latest.populate("sender").execPopulate());

        case 8:
          metaLatest = _context2.sent;
          _context2.next = 11;
          return regeneratorRuntime.awrap(metaLatest.populate("chat").execPopulate());

        case 11:
          metaLatest = _context2.sent;
          _context2.next = 14;
          return regeneratorRuntime.awrap(User.populate(latest, {
            path: "chat.users"
          }));

        case 14:
          metaLatest = _context2.sent;
          _context2.next = 17;
          return regeneratorRuntime.awrap(Chat.findById(req.body.chatId).populate("latestMessage"));

        case 17:
          newChatMessage = _context2.sent;
          _context2.next = 20;
          return regeneratorRuntime.awrap(newChatMessage.update({
            latestMessage: latest
          }));

        case 20:
          newChatMessage = _context2.sent;
          res.status(201).send(metaLatest);
          _context2.next = 28;
          break;

        case 24:
          _context2.prev = 24;
          _context2.t0 = _context2["catch"](0);
          console.log("server Error: " + _context2.t0);
          res.sendStatus(400);

        case 28:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 24]]);
});
module.exports = router;