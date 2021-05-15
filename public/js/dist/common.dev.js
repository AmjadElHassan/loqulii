"use strict";

// const session = require("express-session")
$("#postTextarea").keyup(function (event) {
  var textBox = $(event.target);
  var value = textBox.val().trim();
  var submitButton = $("#submitPostButton");

  if (submitButton.length === 0) {
    return alert("no submit button found");
  }

  if (value == "") {
    submitButton.prop("disabled", true);
    return;
  }

  submitButton.prop("disabled", false);
});
$("#submitPostButton").click(function () {
  var button = $(event.target);
  var textbox = $("#postTextarea").val().trim();
  var data = {
    content: textbox
  };
  $.post("/api/posts", data, function _callee(postData, status, xhr) {
    var html;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(createPostHtml(postData));

          case 2:
            html = _context.sent;
            $(".postsContainer").prepend(html);
            $("#postTextarea").val("");
            button.prop("disabled", true);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    });
  });
});
$(document).on("click", ".likeButton", function (event) {
  var button = $(event.target);
  var postId = getPostId(button);

  if (!postId) {
    alert('Error');
    return console.log("postId issue");
  }

  $.ajax({
    url: "/api/posts/".concat(postId, "/like"),
    type: "PUT",
    success: function success(post) {
      var length = post.likes.length;
      button.find("span").text(length || "");

      if (post.likes.includes(userLoggedIn._id)) {
        button.addClass("active");
      } else {
        button.removeClass("active");
      }
    }
  });
});
$(document).on("click", ".retweetButton", function (event) {
  var button = $(event.target);
  var postId = getPostId(button);

  if (!postId) {
    alert('Error');
    return console.log("postId issue");
  }

  $.ajax({
    url: "/api/posts/".concat(postId, "/retweets"),
    type: "POST",
    success: function success(postData) {
      console.log(postData);
      button.find("span").text(postData.retweetUsers.length || "");

      if (postData.retweetUsers.includes(userLoggedIn._id)) {
        button.addClass("active");
      } else {
        button.removeClass("active");
      }
    }
  });
});

function getPostId(target) {
  var isRoot = target.hasClass("post");
  var rootElement = isRoot ? target : target.closest(".post");
  var postId = rootElement.data().id;

  if (!postId) {
    return false;
  }

  return postId;
}

function createPostHtml(postData) {
  if (!postData.postedBy._id) {
    //in the case that the postedby is just an object id
    return console.log('User object not populated');
  }

  var likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? "active" : "";
  var retweetButtonActiveClass = postData.retweetUsers.includes(userLoggedIn._id) ? "active" : ""; //pulling information from server of current user logged in

  var postContent = postData.content;
  var user = postData.postedBy;
  var userRealName = user.firstName + " ".concat(user.lastName);
  var timestamp = timeDifference(new Date(), new Date(postData.createdAt));
  return "<div class=\"post\" data-id=\"".concat(postData._id, "\">\n                <div class=\"mainContentContainer\">\n                    <div class=\"userImageContainer\">\n                        <img src=\"").concat(user.profilePic, "\">\n                    </div>\n                    <div class=\"postContentContainer\">\n                        <div class=\"header\">\n                            <a class=\"displayName\" href=\"/profile/").concat(user.username, "\">\n                                ").concat(userRealName, "\n                            </a>\n                            <span class=\"username\">@").concat(user.username, "</span>\n                            <span class=\"date\">").concat(timestamp, "</span>\n                        </div>\n                        <div class=\"postBody\">\n                            <span>").concat(postContent || postData.retweetData, "</span>\n                        </div>\n                        <div class=\"postFooter\">\n                            <div class=\"postButtonContainer\">\n                                <button>\n                                    <i class=\"far fa-comment-alt\"></i>\n                                </button>\n                            </div>\n                            <div class=\"postButtonContainer green\">\n                                <button class=\"retweetButton ").concat(retweetButtonActiveClass, "\">\n                                    <i class=\"fas fa-retweet\"></i>\n                                    <span>").concat(postData.retweetUsers.length || "", "</span>\n                                </button>\n                            </div>\n                            <div class=\"postButtonContainer red\">\n                                <button class=\"likeButton ").concat(likeButtonActiveClass, "\">\n                                    <i class=\"far fa-heart\"></i>\n                                    <span>").concat(postData.likes.length || "", "</span>\n                                </button>\n                            </div>\n                        </div>\n                    </div>\n                    \n                </div>\n    </div>");
}

function timeDifference(current, previous) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;
  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    if (elapsed / 1000 < 30) return "Right now";
    return Math.round(elapsed / 1000) + ' seconds ago';
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' minutes ago';
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' hours ago';
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + ' days ago';
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + ' months ago';
  } else {
    return Math.round(elapsed / msPerYear) + ' years ago';
  }
}