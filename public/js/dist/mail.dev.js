"use strict";

$(document).ready(function () {
  $.get("/api/chats", function (data, status, xhr) {
    if (xhr.status == 400) {
      alert("could not retrieve chat list");
    } else {
      outputChatList(data, $(".resultsContainer"));
    }
  });
});

function outputChatList(chatList, container) {
  if (chatList.length == 0) {
    container.append("<span style='text-align: center; display: block; margin-top: var(--spacing)'>No Chats Found</span>");
  }

  chatList.forEach(function (chat) {
    var html = createChatHtml(chat);
    container.append(html);
  });
}

function createChatHtml(chatData) {
  var chatName = getChatName(chatData);
  var image = getChatImageElements(chatData);
  var latestMessage = "Dis dat new new";
  return "<a href=\"/mail/".concat(chatData._id, "\" class=\"resultListItem\">\n    ").concat(image, "\n    <div class=\"resultsDetailsContainer ellipsis\">\n        <span class=\"heading ellipsis\">").concat(chatName, "</span>\n        <span class=\"subText ellipsis\">").concat(latestMessage, "</span>\n    </div>\n    </a>");
}

function getChatImageElements(chatData) {
  var users = getOtherChatUsers(chatData.users);
  var groupChatClass = "";
  var chatImage = getUserChatImageElement(users[0]);

  if (users.length > 1) {
    groupChatClass = "groupChatImage";
    chatImage += getUserChatImageElement(users[1]);
  }

  return "<div class=\"resultsImageContainer ".concat(groupChatClass, "\">").concat(chatImage, "\n    </div>");
}

function getUserChatImageElement(user) {
  if (!user || !user.profilePic) {
    return alert("user profile pic not valid");
  }

  return "<img src='".concat(user.profilePic, "' alt=\"user profile Pic\">");
}