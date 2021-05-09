"use strict";

var express = require('express');

var app = express();
var port = 3000;

var middleware = require('./middleware');

var path = require('path');

app.set("view engine", "pug");
app.set("views", "views");
app.use(express["static"](path.join(__dirname, "public"))); //this serves all of the contents of our public directory as a static file
//to our client
//Routes

var loginRoute = require("./routes/loginRoutes");

app.use("/login", loginRoute);
app.get('/', middleware.requireLogin, function (req, res, next) {
  var payLoad = {
    pageTitle: "home"
  };
  res.status(200).render("home", payLoad);
});
app.listen(port, function () {
  console.log("We are live on port:".concat(port));
});