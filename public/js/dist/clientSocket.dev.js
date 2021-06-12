"use strict";

var connected = false; // module.exports = function(app,server, secret){
//     let clients = {}
// }

var socket = io("http://localhost:3000");
socket.emit("setup", userLoggedIn);
socket.on("connected", function () {
  connected = true;
  console.log('private user room created');
});
socket.on("message received", function (newMessage) {
  console.log(newMessage);
  console.log('message was received');
  messageReceived(newMessage);
});