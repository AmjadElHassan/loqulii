"use strict";

var typing = false;
var lastTypingTime;
$(document).ready(function () {
  socket.emit("join room", chatId);
  socket.on("typing", function () {
    $(".typingDots").show();
  });
  socket.on("stop typing", function () {
    $(".typingDots").hide();
  });
  $.get("/api/chats/".concat(chatId), function (data) {
    $("#chatName").text(getChatName(data));
  });
  $.get("/api/chats/".concat(chatId, "/messages"), function (data) {
    var messages = [];
    var lastSenderId = "";
    data.forEach(function (message, index) {
      var html = createMessageHtml(message, data[index + 1], lastSenderId);
      messages.push(html);
      lastSenderId = message.sender._id;
    });
    var messagesHtml = messages.join('');
    addMessagesHtmlToPage(messagesHtml);
    scrollToBottom(false);
    $(".loadingSpinnerContainer").remove();
    $(".chatContainer").css("visibility", "visible");
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
  updateTyping();

  if (event.which == 13 && !event.shiftKey) {
    messageSubmitted();
    return false;
  }
});

function updateTyping() {
  if (!connected) return;

  if (!typing) {
    typing = true;
    socket.emit("typing", chatId);
  }

  lastTypingTime = new Date().getTime();
  var timerLength = 3000;
  setTimeout(function () {
    var timeNow = new Date().getTime();
    var timeDiff = timeNow - lastTypingTime;

    if (timeDiff >= timerLength && typing) {
      socket.emit("stop typing", chatId);
      typing = false;
    }
  }, timerLength);
}

function messageSubmitted() {
  content = $(".inputTextBox").val().trim();

  if (content != "") {
    sendMessage(content);
    $(".inputTextBox").val("");
    socket.emit("stop typing", chatId);
    typing = false;
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

    if (connected) {
      socket.emit("new message", data);
    }
  });
}

function addChatMessageHtml(message) {
  if (!message || !message._id) {
    return alert("invalid message");
  }

  var messageDiv = createMessageHtml(message, null, '');
  addMessagesHtmlToPage(messageDiv);
  scrollToBottom(true);
}

function createMessageHtml(message, nextMessage, lastSenderId) {
  var sender = message.sender;
  var senderName = sender.firstName + ' ' + sender.lastName;
  var currentSenderId = sender._id;
  var nextSenderId = nextMessage != undefined ? nextMessage.sender._id : "";
  var isFirst = lastSenderId != currentSenderId ? "first" : "";
  var isLast = nextSenderId != currentSenderId ? "last" : "";
  var isMine = message.sender._id == userLoggedIn._id;
  var liClassName = isMine ? "mine" : "theirs";
  var nameElement = "";
  var imageContainer = "";
  var profileImage = "";

  if (isFirst == "first") {
    nameElement = !isMine ? "<span class=\"senderName\">".concat(senderName, "</span>") : "";
  }

  if (isLast == "last") {
    profileImage = "<img src=\"".concat(sender.profilePic, "\">");
  }

  if (!isMine) {
    imageContainer = "<div class='imageContainer'>".concat(profileImage, "</div>");
  }

  return "\n    <li class='message ".concat(liClassName, " ").concat(isFirst, " ").concat(isLast, "'>\n        ").concat(imageContainer, "\n        <div class=\"messageContainer\">\n        ").concat(nameElement, "\n        <span class=\"messageBody\">\n            ").concat(message.content, "\n        </span>\n        </div>\n    \n    </li>");
}

function addMessagesHtmlToPage(html) {
  $(".chatMessages").append(html); //TODO: SCROLL TO BOTTOM
}

function scrollToBottom(animated) {
  var container = $(".chatContainer");
  var scrollHeight = container[0].scrollHeight;

  if (animated) {
    container.animate({
      scrollTop: scrollHeight
    }, "slow");
  } else {
    container.scrollTop(scrollHeight);
  }
}