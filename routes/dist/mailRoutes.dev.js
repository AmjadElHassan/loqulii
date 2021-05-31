"use strict";

var express = require('express');

var mongoose = require('mongoose');

var app = express();
var router = express.Router();

var bodyParser = require('body-parser');

var User = require('../schemas/UserSchema');

var bcrypt = require("bcrypt");

var session = require('express-session');

var Chat = require('../schemas/ChatSchema');

router.get('/', function _callee(req, res, next) {
  var payLoad;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          //we configured the router to handle requests at root "/" 
          payLoad = {
            pageTitle: "Inbox",
            userLoggedIn: req.session.user,
            userLoggedInJs: JSON.stringify(req.session.user)
          };
          res.status(200).render("mailPage", payLoad);

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
});
router.get('/new', function _callee2(req, res, next) {
  var payLoad;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          //we configured the router to handle requests at root "/" 
          payLoad = {
            pageTitle: "New Message",
            userLoggedIn: req.session.user,
            userLoggedInJs: JSON.stringify(req.session.user)
          };
          res.status(200).render("newMessage", payLoad);

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
});
router.get('/:chatId', function _callee3(req, res, next) {
  var userId, chatId, isValidId, payLoad, chat, userFound;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userId = req.session.user._id;
          chatId = req.params.chatId;
          isValidId = mongoose.isValidObjectId(chatId);
          payLoad = {
            pageTitle: "Chat",
            userLoggedIn: req.session.user,
            userLoggedInJs: JSON.stringify(req.session.user)
          };

          if (isValidId) {
            _context3.next = 8;
            break;
          }

          payLoad.errorMessage = "chat does not exist or you do not have proper permissions";
          return _context3.abrupt("return", res.status(200).render("chatPage", payLoad));

        case 8:
          _context3.next = 10;
          return regeneratorRuntime.awrap(Chat.findOne({
            _id: chatId,
            users: {
              $elemMatch: {
                $eq: userId
              }
            }
          }).populate("users"));

        case 10:
          chat = _context3.sent;

          if (!(chat == null)) {
            _context3.next = 19;
            break;
          }

          _context3.next = 14;
          return regeneratorRuntime.awrap(User.findById(chatId));

        case 14:
          userFound = _context3.sent;

          if (!(userFound != null)) {
            _context3.next = 19;
            break;
          }

          _context3.next = 18;
          return regeneratorRuntime.awrap(getChatbyUserId(userFound._id, userId));

        case 18:
          chat = _context3.sent;

        case 19:
          if (chat == null || chat == undefined) {
            payLoad.errorMessage = "chat does not exist or you do not have proper permissions";
          } else {
            payLoad.chat = chat;
          }

          res.status(200).render("chatPage", payLoad);
          _context3.next = 27;
          break;

        case 23:
          _context3.prev = 23;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);
          res.sendStatus(400);

        case 27:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 23]]);
});

function getChatbyUserId(userLoggedIn, otherUserId) {
  return Chat.findOneAndUpdate({
    //first Object: filters for chats with only 2 people
    isGroupChat: false,
    users: {
      $size: 2,
      $all: [{
        $elemMatch: {
          $eq: mongoose.Types.ObjectId(userLoggedIn._id)
        }
      }, {
        $elemMatch: {
          $eq: mongoose.Types.ObjectId(otherUserId)
        }
      }]
    }
  }, //second object: if nothing returned from filter, create new chat with these users
  {
    $setOnInsert: {
      users: [userLoggedIn, otherUserId]
    }
  }, //third object: return the new chat, post-database update. upsert, is the option that creates the new chat
  {
    "new": true,
    upsert: true
  }).populate("users");
}

module.exports = router;