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
app.set("views", "views");

var server = require('http').createServer(app);

app.listen(process.env.PORT || PORT, function () {
  console.log("We are live on port:".concat(PORT));
});
server.listen(3001, function () {
  console.log('server thing connected');
});

var io = require("socket.io")(server, {
  pingTimeout: 60000
}); //passive tools


app.use(morgan("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express["static"](path.join(__dirname, "public"))); //this serves all of the contents of our public directory as a static file to our client

app.use(session({
  secret: process.env.SessionString,
  resave: true,
  saveUninitialized: false
}));
io.on("connection", function (socket) {
  socket.on("setup", function (userData) {
    socket.join(userData._id); //creates a user-specific room. this allows us a place to send all user notifications to

    socket.emit("connected");
  });
  socket.on("join room", function (room) {
    return socket.join(room);
  });
  socket.on("typing", function (room) {
    return socket["in"](room).emit("typing");
  });
  socket.on("stop typing", function (room) {
    return socket["in"](room).emit("stop typing");
  });
  socket.on("new message", function (newMessage) {
    var chat = newMessage.chat;
    if (!chat.users) return "chat.users not defined";
    chat.users.forEach(function (user) {
      console.log(user._id);
      if (user._id == newMessage.sender._id) return;
      socket["in"](user._id).emit("message received", newMessage);
    });
  });
}); //Routes

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
server;