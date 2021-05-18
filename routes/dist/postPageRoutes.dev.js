"use strict";

var express = require('express');

var app = express();
var router = express.Router();

var bodyParser = require('body-parser');

var User = require('../schemas/UserSchema');

var bcrypt = require("bcrypt");

var session = require('express-session');

router.get('/:id', function (req, res, next) {
  //we configured the router to handle requests at root "/" 
  console.log(req.params);

  if (!req.session.user) {
    return res.status(200).redirect("/");
  }

  var payLoad = {
    pageTitle: "View Post",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
    postId: JSON.stringify(req.params.id)
  };
  console.log(payLoad.postId);
  res.status(200).render("postPage", payLoad);
});
module.exports = router;