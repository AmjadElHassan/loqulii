"use strict";

var express = require('express');

var app = express();
var port = 3000;

var middleware = require('./middleware');

var path = require('path');

var bodyParser = require('body-parser');

var morgan = require('morgan');

var mongoose = require('./database');

var session = require('express-session');

require('dotenv').config();

app.set("view engine", "pug");
app.set("views", "views");
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express["static"](path.join(__dirname, "public"))); //this serves all of the contents of our public directory as a static file to our client

app.use(session({
  secret: process.env.SessionString,
  resave: true,
  saveUninitialized: false
})); //Routes

var loginRoute = require("./routes/loginRoutes");

var registerRoute = require("./routes/registerRoutes");

var logoutRoute = require("./routes/logoutRoutes");

app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/logout", logoutRoute); //api routes

var postRoute = require("./routes/api/postRoutes");

app.use("/api/posts", postRoute);
app.get('/', middleware.requireLogin, function (req, res, next) {
  var payLoad = {
    pageTitle: "Home",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user)
  };
  res.status(200).render("home", payLoad);
});
app.listen(process.env.PORT, function () {
  console.log("We are live on port:".concat(port));
});