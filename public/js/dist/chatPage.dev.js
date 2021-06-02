"use strict";

$(document).ready(function () {
  $.get("/api/chats/".concat(chatId), function (data) {
    $("#chatName").text(getChatName(data));
    console.log(data);
  });
});
$("#submitChatName").click(function () {
  var name = $("#chatNameTextBox").val().trim();
  $.ajax({
    url: "/api/chats/".concat(chatId),
    type: "PUT",
    data: {
      chatName: name
    },
    success: function success(data, status, xhr) {
      if (xhr.status != 204) {
        alert('update failed');
      } else {
        location.reload();
      }
    }
  });
});