"use strict";

$("#postTextarea, #replyTextarea").keyup(function (event) {
  var textBox = $(event.target);
  var value = textBox.val().trim();
  var isModal = textBox.parents(".modal").length == 1;
  var submitButton = isModal ? $("#submitReply") : $("#submitPostButton");

  if (submitButton.length === 0) {
    return alert("no submit button found");
  }

  if (value == "") {
    submitButton.prop("disabled", true);
    return;
  }

  submitButton.prop("disabled", false);
});
$("#submitPostButton, #submitReply").click(function () {
  var button = $(event.target);
  var isModal = button.parents(".modal").length == 1;
  var textbox = isModal ? $("#replyTextarea") : $("#postTextarea");
  var data = {
    content: textbox.val().trim()
  };

  if (isModal) {
    var id = button.data().id;
    data.replyTo = id;
  }

  $.post("/api/posts", data, function _callee(postData) {
    var html;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!postData.replyTo) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return", location.reload());

          case 2:
            _context.next = 4;
            return regeneratorRuntime.awrap(createPostHtml(postData));

          case 4:
            html = _context.sent;
            $(".postsContainer").prepend(html);
            $("#postTextarea").val("");
            button.prop("disabled", true);

          case 8:
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
$("#replyModal").on("show.bs.modal", function _callee2(event) {
  var button, postId;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          button = $(event.relatedTarget);
          postId = getPostId(button);
          $("#submitReply").data("id", postId);
          $.get("/api/posts/".concat(postId), function (results) {
            outputPosts(results.postData, $("#originalPostContainer"));
          });

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
});
$("#replyModal").on("hidden.bs.modal", function _callee3(event) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          $("#originalPostContainer").html("");

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
});
$("#deletePostModal").on("show.bs.modal", function _callee4(event) {
  var button, postId;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          button = $(event.relatedTarget);
          postId = getPostId(button);
          _context4.next = 4;
          return regeneratorRuntime.awrap($("#submitDelete").data("id", postId));

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  });
});
$("#submitDelete").click(function _callee5(event) {
  var postId;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap($(event.target).data("id"));

        case 3:
          postId = _context5.sent;
          console.log(postId);
          $.ajax({
            url: "/api/posts/".concat(postId),
            type: "DELETE",
            success: function success(response) {
              location.reload();
            }
          });
          _context5.next = 11;
          break;

        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](0);
          console.log(_context5.t0);

        case 11:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
$(document).on("click", ".followButton", function _callee6(event) {
  var button, userId;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          button = $(event.target);
          _context6.next = 3;
          return regeneratorRuntime.awrap(button.data().user);

        case 3:
          userId = _context6.sent;
          $.ajax({
            url: "/api/users/".concat(userId, "/follow"),
            type: "PUT",
            success: function success(data, status, xhr) {
              if (xhr.status == 404) {
                return alert(data);
              }

              var difference = 1;

              if (data.following.includes(userId)) {
                button.addClass("following");
                button.text("following");
              } else {
                button.removeClass("following");
                button.text("follow");
                difference = -1;
              }

              var followersLabel = $("#followersValue");

              if (followersLabel.length != 0) {
                var followersText = followersLabel.text();
                followersLabel.text(Number(followersText) + Number(difference));
              }
            }
          }); // let postId = getPostId(element)
          // if (postId && !element.is("button")) {
          //     window.location.href = `/post/${postId}`
          // }

        case 5:
        case "end":
          return _context6.stop();
      }
    }
  });
});
$(document).on("click", ".post", function (event) {
  var element = $(event.target);
  var postId = getPostId(element);

  if (postId && !element.is("button")) {
    window.location.href = "/post/".concat(postId);
  }
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
  var postFocus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var postFocusClass = postFocus ? "postFocus" : "";
  if (!postData) return alert("post object is null");
  var isReply = postData.replyTo ? true : false;
  var isRetweet = postData.retweetData ? true : false;
  retweetedBy = isRetweet ? postData.postedBy.username : null;
  postData = isRetweet ? postData.retweetData : postData;

  if (!postData.postedBy._id) {
    //in the case that the postedby is just an object id
    return console.log('User object not populated');
  }

  var likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? "active" : "";
  var retweetButtonActiveClass = postData.retweetUsers.includes(userLoggedIn._id) ? "active" : ""; //pulling information from server of current user logged in

  var postContent = postData.content;
  var user = postData.postedBy;
  var userRealName = user.firstName + " ".concat(user.lastName);
  var timestamp = timeDifference(new Date(), new Date(postData.createdAt)); //retweet indication

  var retweetText = "";

  if (isRetweet) {
    retweetText = "<span>\n        <i class=\"fas fa-retweet\"></i>\n        Retweeted by <a href=\"/profile/".concat(retweetedBy, "\">\n        ").concat(retweetedBy, "\n        </a>\n        </span>");
  } //reply indication


  var replyFlag = "";

  if (isReply && postData.replyTo._id) {
    if (!postData.replyTo._id) {
      return alert("replyTo is not poulated");
    }

    var userReplyingTo = postData.replyTo.postedBy.username;
    replyFlag = "<div class=\"replyFlag\">Replying To <a href=\"/profile/".concat(userReplyingTo, "\">@").concat(userReplyingTo, "</a></div>");
  } //delete indication


  var creatorButtons = "";

  if (postData.postedBy._id === userLoggedIn._id) {
    creatorButtons = "<div class=\"creatorButtons\"><button data-id=\"".concat(postData._id, "\" data-toggle=\"modal\" data-target=\"#deletePostModal\" class=\"deleteButton\">\n        <i class=\"far fa-times-circle\"></i>\n        </button>\n        </div>");
  }

  return "<div class=\"post ".concat(postFocusClass, "\" data-id=\"").concat(postData._id, "\">\n                <div class=\"postActionContainer\">\n                    ").concat(retweetText, "\n                </div>\n                <div class=\"mainContentContainer\">\n                    <div class=\"userImageContainer\">\n                        <img src=\"").concat(user.profilePic, "\">\n                    </div>\n                    <div class=\"postContentContainer\">\n                        <div class=\"header\">\n                            <a class=\"displayName\" href=\"/profile/").concat(user.username, "\">\n                                ").concat(userRealName, "\n                            </a>\n                            <span class=\"username\">@").concat(user.username, "</span>\n                            <span class=\"date\">").concat(timestamp, "</span>\n                            ").concat(creatorButtons, "\n                        </div>\n                        ").concat(replyFlag, "\n                        <div class=\"postBody\">\n                            <span>").concat(postContent || postData.retweetData, "</span>\n                        </div>\n                        <div class=\"postFooter\">\n                            <div class=\"postButtonContainer\">\n                                <button class=\"replyButton\" data-toggle=\"modal\" data-target=\"#replyModal\">\n                                    <i class=\"far fa-comment-alt\"></i>\n                                </button>\n                            </div>\n                            <div class=\"postButtonContainer green\">\n                                <button class=\"retweetButton ").concat(retweetButtonActiveClass, "\">\n                                    <i class=\"fas fa-retweet\"></i>\n                                    <span>").concat(postData.retweetUsers.length || "", "</span>\n                                </button>\n                            </div>\n                            <div class=\"postButtonContainer red\">\n                                <button class=\"likeButton ").concat(likeButtonActiveClass, "\">\n                                    <i class=\"far fa-heart\"></i>\n                                    <span>").concat(postData.likes.length || "", "</span>\n                                </button>\n                            </div>\n                        </div>\n                    </div>\n                    \n                </div>\n    </div>");
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

function outputPosts(posts, container) {
  container.html("");

  if (!posts) {
    return container.append("<span class='no results'>No Results Found</span>");
  }

  if (!Array.isArray(posts)) {
    posts = [posts];
  }

  posts.forEach(function (post) {
    var html = createPostHtml(post);
    container.append(html);
  });
}

function outputPostsWithReplies(posts, container) {
  container.html("");

  if (!posts) {
    return container.append("<span class='no results'>No Results Found</span>");
  }

  if (posts.replyTo && posts.replyTo._id) {
    var html = createPostHtml(posts.replyTo);
    container.append(html);
  }

  var mainPostHtml = createPostHtml(posts.postData, true);
  container.append(mainPostHtml);
  posts.replies.forEach(function (post) {
    var replyHtml = createPostHtml(post);
    container.append(replyHtml);
  });
}