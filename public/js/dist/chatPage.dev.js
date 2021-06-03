"use strict";

$(document).ready(function () {
  $.get("/api/chats/".concat(chatId), function (data) {
    $("#chatName").text(getChatName(data));
  });
  $.get("/api/chats/".concat(chatId, "/messages"), function (data) {
    data.forEach(function (message) {
      addChatMessageHtml(message);
    });
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
$(".sendMessageButton").click(function () {
  messageSubmitted();
});
$(".inputTextBox").keydown(function (event) {
  if (event.which == 13 && !event.shiftKey) {
    messageSubmitted();
    return false;
  }
});

function messageSubmitted() {
  content = $(".inputTextBox").val().trim();

  if (content != "") {
    sendMessage(content);
    $(".inputTextBox").val("");
  }
}

function sendMessage(content) {
  $.post("/api/messages", {
    content: content,
    chatId: chatId
  }, function (data, status, xhr) {
    if (xhr.status != 201) {
      alert("could not send message");
      $("inputTextBox").val(content);
      return;
    }

    $("#chatName").text(getChatName(data.chat));
    addChatMessageHtml(data);
  });
}

function addChatMessageHtml(message) {
  if (!message || !message._id) {
    return alert("invalid message");
  }

  var messageDiv = createMessageHtml(message);
  $(".chatMessages").append(messageDiv);
}

function createMessageHtml(message) {
  console.log(message);
  var isMine = message.sender._id == userLoggedIn._id;
  var liClassName = isMine ? "mine" : "theirs";
  return "\n    <li class='message ".concat(liClassName, "'>\n        <div class=\"messageContainer\">\n        <span class=\"messageBody\">\n            ").concat(message.content, "\n        </span>\n        </div>\n    \n    </li>");
}