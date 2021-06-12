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
  var searchObj, results;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          searchObj = req.query;

          if (searchObj.search) {
            searchObj = {
              $or: [{
                firstName: {
                  $regex: searchObj.search,
                  $options: "i"
                }
              }, {
                lastName: {
                  $regex: searchObj.search,
                  $options: "i"
                }
              }, {
                username: {
                  $regex: searchObj.search,
                  $options: "i"
                }
              }]
            };
            delete searchObj.search;
          }

          _context.next = 4;
          return regeneratorRuntime.awrap(getUsers(searchObj));

        case 4:
          results = _context.sent;
          res.status(200).send(results);

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
});
router.put('/:userId/follow', function _callee2(req, res, next) {
  var currentUser, user2FollowId, user2Follow, isFollowing, option;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          currentUser = req.session.user;

          if (currentUser) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.sendStatus(200).redirect('/'));

        case 4:
          user2FollowId = req.params.userId;
          _context2.next = 7;
          return regeneratorRuntime.awrap(User.find({
            _id: user2FollowId
          }));

        case 7:
          user2Follow = _context2.sent;

          if (user2Follow) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", res.sendStatus(404));

        case 10:
          if (!(user2Follow.length != 1)) {
            _context2.next = 12;
            break;
          }

          return _context2.abrupt("return", res.sendStatus(404).send('multiple users found'));

        case 12:
          user2Follow = user2Follow[0];
          isFollowing = user2Follow.followers !== undefined && user2Follow.followers.includes(currentUser._id);
          option = isFollowing ? "$pull" : "$addToSet";
          _context2.next = 17;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(currentUser._id, _defineProperty({}, option, {
            following: user2FollowId
          }), {
            "new": true
          }));

        case 17:
          req.session.user = _context2.sent;
          _context2.next = 20;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(user2FollowId, _defineProperty({}, option, {
            followers: currentUser._id
          }), {
            "new": true
          }));

        case 20:
          user2Follow = _context2.sent;
          res.status(200).send(req.session.user);
          _context2.next = 28;
          break;

        case 24:
          _context2.prev = 24;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);
          res.status(404);

        case 28:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 24]]);
});
router.get('/:userId/followers', function _callee3(req, res, next) {
  var profileUser;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(User.findById(req.params.userId).populate("followers"));

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
router.get('/:userId/following', function _callee4(req, res, next) {
  var profileUser;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(User.findById(req.params.userId).populate("following"));

        case 3:
          profileUser = _context4.sent;
          // let followerList = await User.populate(profileUser,{path: })
          res.status(202).send(profileUser);
          _context4.next = 11;
          break;

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          console.log(_context4.t0);
          res.status(400).send("Could not retrieve follower list");

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
router.post('/profilePicture', upload.single("croppedImage"), function _callee6(req, res, next) {
  var filePath, tempPath, targetPath;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          try {
            if (!req.file) {
              console.log('no file uploaded');
              res.sendStatus(400);
            }

            filePath = "/uploads/images/".concat(req.file.filename, ".png");
            tempPath = req.file.path;
            targetPath = path.join(__dirname, "../../".concat(filePath));
            fs.rename(tempPath, targetPath, function _callee5(error) {
              return regeneratorRuntime.async(function _callee5$(_context5) {
                while (1) {
                  switch (_context5.prev = _context5.next) {
                    case 0:
                      if (!(error != null)) {
                        _context5.next = 3;
                        break;
                      }

                      console.log(error);
                      return _context5.abrupt("return", res.status(400));

                    case 3:
                      _context5.next = 5;
                      return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.session.user._id, {
                        profilePic: filePath
                      }, {
                        "new": true
                      }));

                    case 5:
                      req.session.user = _context5.sent;
                      res.sendStatus(204);

                    case 7:
                    case "end":
                      return _context5.stop();
                  }
                }
              });
            });
          } catch (err) {
            console.log(err);
            res.sendStatus(400).send("profile picture upload failed");
          }

        case 1:
        case "end":
          return _context6.stop();
      }
    }
  });
});
router.post('/coverPhoto', upload.single("croppedImage"), function _callee8(req, res, next) {
  var filePath, tempPath, targetPath;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          try {
            if (!req.file) {
              console.log('no file uploaded');
              res.sendStatus(400);
            }

            filePath = "/uploads/images/".concat(req.file.filename, ".png");
            tempPath = req.file.path;
            targetPath = path.join(__dirname, "../../".concat(filePath));
            fs.rename(tempPath, targetPath, function _callee7(error) {
              return regeneratorRuntime.async(function _callee7$(_context7) {
                while (1) {
                  switch (_context7.prev = _context7.next) {
                    case 0:
                      if (!(error != null)) {
                        _context7.next = 3;
                        break;
                      }

                      console.log(error);
                      return _context7.abrupt("return", res.sendStatus(400));

                    case 3:
                      _context7.next = 5;
                      return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.session.user._id, {
                        coverPhoto: filePath
                      }, {
                        "new": true
                      }));

                    case 5:
                      req.session.user = _context7.sent;
                      res.sendStatus(204);

                    case 7:
                    case "end":
                      return _context7.stop();
                  }
                }
              });
            });
          } catch (err) {
            console.log(err);
            res.status(400).send("profile picture upload failed");
          }

        case 1:
        case "end":
          return _context8.stop();
      }
    }
  });
});

function getUsers(searchObject) {
  return regeneratorRuntime.async(function getUsers$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap(User.find(searchObject));

        case 3:
          return _context9.abrupt("return", _context9.sent);

        case 6:
          _context9.prev = 6;
          _context9.t0 = _context9["catch"](0);
          console.log(_context9.t0);

        case 9:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 6]]);
}

module.exports = router;