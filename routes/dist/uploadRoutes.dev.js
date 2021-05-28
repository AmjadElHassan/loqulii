"use strict";

var express = require('express');

var app = express();
var router = express.Router();

var bodyParser = require('body-parser');

var User = require('../schemas/UserSchema');

var bcrypt = require("bcrypt");

var session = require('express-session');

var path = require('path');

router.get('/images/:path', function _callee(req, res, next) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          //we configured the router to handle requests at root "/" 
          res.sendFile(path.join(__dirname, "../uploads/images/".concat(req.params.path)));

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
});
module.exports = router;