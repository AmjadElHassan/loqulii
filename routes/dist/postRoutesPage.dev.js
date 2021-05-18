"use strict";

var express = require('express');

var app = express();
var router = express.Router();

var bodyParser = require('body-parser');

var User = require('../schemas/UserSchema');

var bcrypt = require("bcrypt");

var session = require('express-session');

app.use(bodyParser.urlencoded({
  extended: false
}));
router.get('/:id', function (req, res, next) {
  //we configured the router to handle requests at root "/" 
  var payLoad = {
    pageTitle: "View Post",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
    postId: req.params.id
  };
  res.status(200).render("postPage", payLoad);
});
module.exports = router;