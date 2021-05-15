"use strict";

var express = require('express');

var app = express();
var router = express.Router();

var bodyParser = require('body-parser');

var User = require('../schemas/UserSchema');

var bcrypt = require("bcrypt");

app.use(bodyParser.urlencoded({
  extended: false
}));
router.get('/', function (req, res, next) {
  if (req.session) {
    req.session.destroy(function () {
      console.log('okay');
      res.redirect('/');
    });
  }
});
module.exports = router;