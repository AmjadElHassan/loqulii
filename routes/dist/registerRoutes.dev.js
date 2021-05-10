"use strict";

var express = require('express');

var app = express();
var router = express.Router();
app.set("view engine", "pug");
app.set("views", "views");
router.get('/', function (req, res, next) {
  //we configured the router to handle requests at root "/" 
  res.status(200).render("register"); //to load the login interface
});
module.exports = router;