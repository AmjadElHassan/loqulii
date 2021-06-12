"use strict";

var express = require('express');

var app = express();
var PORT = 3000;

var middleware = require('./middleware');

var path = require('path');

var bodyParser = require('body-parser');

var morgan = require('morgan');

var mongoose = require('./database');

var session = require('express-session');

require('dotenv').config();

app.set("view engine", "pug");
app.set("views", "views"); //passive tools

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

var postPageRoute = require("./routes/postPageRoutes");

var profileRoute = require("./routes/profileRoutes");

var uploadRoute = require("./routes/uploadRoutes");

var searchRoute = require("./routes/searchRoutes");

var mailRoute = require("./routes/mailRoutes");

app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/post", postPageRoute);
app.use("/logout", logoutRoute);
app.use("/profile", middleware.requireLogin, profileRoute);
app.use("/uploads", uploadRoute);
app.use("/search", middleware.requireLogin, searchRoute);
app.use("/mail", middleware.requireLogin, mailRoute); //api routes

var postRoute = require("./routes/api/postRoutes");

var usersRoute = require("./routes/api/usersRoutes");

var chatRoute = require("./routes/api/chatRoutes");

var messageRoute = require("./routes/api/messageRoutes");

app.use("/api/posts", postRoute);
app.use("/api/users", usersRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);
app.get('/', middleware.requireLogin, function (req, res, next) {
  var payLoad = {
    pageTitle: "Home",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user)
  };
  res.status(200).render("home", payLoad);
});
app.listen(process.env.PORT || PORT, function () {
  console.log("We are live on port:".concat(PORT));
});