//globals
let cropper;
let timer;
let selectedUsers = []

$("#postTextarea, #replyTextarea").keyup((event) => {
    let textBox = $(event.target)
    let value = textBox.val().trim()

    let isModal = textBox.parents(".modal").length == 1
    let submitButton = isModal ? $("#submitReply") : $("#submitPostButton")

    if (submitButton.length === 0) {
        return alert("no submit button found")
    }

    if (value == "") {
        submitButton.prop("disabled", true);
        return
    }

    submitButton.prop("disabled", false)
})

$("#submitPostButton, #submitReply").click(() => {
    let button = $(event.target)

    let isModal = button.parents(".modal").length == 1
    let textbox = isModal ? $("#replyTextarea") : $("#postTextarea");

    let data = {
        content: textbox.val().trim()
    }
    if (isModal) {
        let id = button.data().id
        data.replyTo = id
    }
    $.post("/api/posts", data, async (postData) => {

        if (postData.replyTo) {
            return location.reload()
        }
        let html = await createPostHtml(postData)
        $(".postsContainer").prepend(html)
        $("#postTextarea").val("")
        button.prop("disabled", true)

    })

})

$(document).on("click", ".likeButton", (event) => {
    let button = $(event.target);
    let postId = getPostId(button)
    if (!postId) {
        alert('Error')
        return console.log("postId issue")
    }
    $.ajax({
        url: `/api/posts/${postId}/like`,
        type: "PUT",
        success: (post) => {
            let length = post.likes.length
            button.find("span").text(length || "")
            if (post.likes.includes(userLoggedIn._id)) {
                button.addClass("active")
            } else {
                button.removeClass("active")
            }

        }
    })
})

$(document).on("click", ".retweetButton", (event) => {
    let button = $(event.target)
    let postId = getPostId(button)
    if (!postId) {
        alert('Error')
        return console.log("postId issue")
    }
    $.ajax({
        url: `/api/posts/${postId}/retweets`,
        type: "POST",
        success: (postData) => {
            console.log(postData)
            button.find("span").text(postData.retweetUsers.length || "")
            if (postData.retweetUsers.includes(userLoggedIn._id)) {
                button.addClass("active")
            } else {
                button.removeClass("active")
            }
        }
    })

})

$("#replyModal").on("show.bs.modal", async (event) => {
    let button = $(event.relatedTarget)
    let postId = getPostId(button)
    $("#submitReply").data("id", postId)

    $.get(`/api/posts/${postId}`, (results) => {
        outputPosts(results.postData, $("#originalPostContainer"))
    })
})

$("#replyModal").on("hidden.bs.modal", async (event) => {
    $("#originalPostContainer").html("")
})

$("#deletePostModal").on("show.bs.modal", async (event) => {
    let button = $(event.relatedTarget)
    let postId = getPostId(button)
    await $("#submitDelete").data("id", postId)
})

$("#pinPostModal").on("show.bs.modal", async (event) => {
    let button = $(event.relatedTarget)
    let postId = getPostId(button)
    await $("#submitPinPost").data("id", postId)
})

$("#unpinPostModal").on("show.bs.modal", async (event) => {
    let button = $(event.relatedTarget)
    let postId = getPostId(button)
    await $("#submitUnpinPost").data("id", postId)
})


$("#submitDelete").click(async (event) => {
    try {
        let postId = await $(event.target).data("id")
        $.ajax({
            url: `/api/posts/${postId}`,
            type: "DELETE",
            success: (response) => {
                location.reload()
            }
        })
    }
    catch (err) {
        console.log(err)
    }
})

$("#submitPinPost").click(async (event) => {
    try {
        let postId = await $(event.target).data("id")
        $.ajax({
            url: `/api/posts/${postId}`,
            type: "PUT",
            data: { pinned: true },
            success: (response) => {
                location.reload()
            }
        })
    }
    catch (err) {
        console.log(err)
    }
})

$("#submitUnpinPost").click(async (event) => {
    try {
        let postId = await $(event.target).data("id")
        $.ajax({
            url: `/api/posts/${postId}`,
            type: "PUT",
            data: { pinned: false },
            success: (response) => {
                location.reload()
            }
        })
    }
    catch (err) {
        console.log(err)
    }
})


$("#filePhoto").change(function () {
    // let input = $(event.target)

    if (this.files && this.files[0]) {
        let reader = new FileReader()
        reader.onload = (e) => {
            let image = document.getElementById('imagePreview')
            image.src = e.target.result

            if (cropper !== undefined) {
                cropper.destroy()
            }

            cropper = new Cropper(image, {
                aspectRatio: 1 / 1,
                background: false
            })
        }
        reader.readAsDataURL(this.files[0])
    }
})

$("#coverPhoto").change(function () {
    if (this.files && this.files[0]) {
        let reader = new FileReader()
        reader.onload = (e) => {
            let image = document.getElementById('coverPreview')
            image.src = e.target.result
            if (cropper !== undefined) {
                cropper.destroy()
            }    
            cropper = new Cropper(image, {
                aspectRatio: 16 / 9,
                background: false
            })
        }
        reader.readAsDataURL(this.files[0])
    }
})

$("#coverPhotoUploadButton").click((event) => {
    let canvas = cropper.getCroppedCanvas();

    if (canvas == null) {
        alert("could not upload image");
        return
    }

    canvas.toBlob(async (blob) => {
        try {
            let formData = new FormData();
            formData.append("croppedImage", blob);
            $.ajax({
                url: "/api/users/coverPhoto",
                type: "post",
                data: formData,
                processData: false,
                contentType: false,
                success: (res) => {
                    location.reload()
                }
            })
        }
        catch (err) {
            console.log(err)
        }
    })
})

$("#imageUploadButton").click((event) => {
    let canvas = cropper.getCroppedCanvas();

    if (canvas == null) {
        alert("could not upload image");
        return
    }

    canvas.toBlob(async (blob) => {
        try {
            let formData = new FormData();
            formData.append("croppedImage", blob);
            $.ajax({
                url: "/api/users/profilePicture",
                type: "post",
                data: formData,
                processData: false,
                contentType: false,
                success: (res) => {
                    location.reload()
                }
            })
        }
        catch (err) {
            console.log(err)
        }
    })
})

$("#createChatButton").click((event) => {
    let data = JSON.stringify(selectedUsers)

    $.post("/api/chats", {users: data}, async (response)=>{

        if (!response||!response._id){
            return alert('invalid server response')
        }
        window.location.href = `/mail/${response._id}`

    })
})


$(document).on("click", ".followButton", async (event) => {
    let button = $(event.target)
    let userId = await button.data().user
    $.ajax({
        url: `/api/users/${userId}/follow`,
        type: "PUT",
        success: (data, status, xhr) => {
            if (xhr.status == 404) {
                return alert(data)
            }

            let difference = 1

            if (data.following.includes(userId)) {
                button.addClass("following")
                button.text("following")
            } else {
                button.removeClass("following")
                button.text("follow")
                difference = -1
            }

            let followersLabel = $("#followersValue")
            if (followersLabel.length != 0) {
                let followersText = followersLabel.text()
                followersLabel.text(Number(followersText) + Number(difference))
            }
        }
    })
    // let postId = getPostId(element)

    // if (postId && !element.is("button")) {
    //     window.location.href = `/post/${postId}`
    // }
})

$(document).on("click", ".post", (event) => {
    let element = $(event.target)
    let postId = getPostId(element)

    if (postId && !element.is("button")) {
        window.location.href = `/post/${postId}`
    }
})

$("#userSearchTextBox").keydown(async (event) => {
    clearTimeout(timer);
    let textbox = $(event.target);
    let value = await textbox.val();

    if (value=="" && (event.which == 8 || (event.keyCode == 8))){
        selectedUsers.pop();
        updateSelectedUsersHtml()
        $(".resultsContainer").html("")

        if (selectedUsers.length==0){
            $("#createChatButton").prop("disabled",true)
        }
        return
    }

    timer = setTimeout(async () => {
        value = textbox.val().trim();
        
        if (value == "") {
            return $(".resultsContainer").html("")
        } else {
            searchUsers(value)
        }
    }, 1000)

})

function getPostId(target) {
    let isRoot = target.hasClass("post");
    let rootElement = isRoot ? target : target.closest(".post")
    let postId = rootElement.data().id
    if (!postId) {
        return false
    }
    return postId
}

function createPostHtml(postData, postFocus = false) {
    let postFocusClass = postFocus ? "postFocus" : ""
    if (!postData) return alert("post object is null")
    let isReply = postData.replyTo ? true : false
    let isRetweet = (postData.retweetData ? true : false)
    retweetedBy = isRetweet ? postData.postedBy.username : null;

    postData = isRetweet ? postData.retweetData : postData
    if (postData.postedBy._id==null||postData.postedBy._id==undefined) {//in the case that the postedby is just an object id
        return console.log('User object not populated')
    }

    let likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? "active" : ""
    let retweetButtonActiveClass = postData.retweetUsers.includes(userLoggedIn._id) ? "active" : ""


    //pulling information from server of current user logged in
    let postContent = postData.content
    let user = postData.postedBy
    let userRealName = user.firstName + ` ${user.lastName}`
    let timestamp = timeDifference(new Date(), new Date(postData.createdAt))
    //retweet header
    let retweetText = "";
    if (isRetweet) {
        retweetText = `<span>
        <i class="fas fa-retweet"></i>
        Retweeted by <a href="/profile/${retweetedBy}">
        ${retweetedBy}
        </a>
        </span>`
    }
    //pinned header
    let pinnedFlag = ""
    if (postData.pinned==true){
        pinnedFlag = 
        `<span>
        <i class="fas fa-thumbtack"></i>
        Pinned Post
        </span>`
    }

    //reply indication
    let replyFlag = ""
    if (isReply && postData.replyTo._id) {
        if (!postData.replyTo._id) {
            return alert("replyTo is not poulated")
        }
        let userReplyingTo = postData.replyTo.postedBy.username
        replyFlag = `<div class="replyFlag">Replying To <a href="/profile/${userReplyingTo}">@${userReplyingTo}</a></div>`
    }

    //delete/pin buttons
    let creatorButtons = ""
    let dataTarget = "#pinPostModal"
    if (postData.postedBy._id === userLoggedIn._id) {

        let pinnedIndicator = ""
        if (postData.pinned == true){
            pinnedIndicator = "pinned"
            dataTarget = "#unpinPostModal"
        }

        creatorButtons = `
        <div class="creatorButtons">
        <button data-id="${postData._id}" data-toggle="modal" data-target="${dataTarget}" class="pinButton ${pinnedIndicator}">
        <i class="fas fa-thumbtack"></i>
        </button>
        <button data-id="${postData._id}" data-toggle="modal" data-target="#deletePostModal" class="deleteButton">
        <i class="far fa-times-circle"></i>
        </button>
        </div>`
    }

    return `<div class="post ${postFocusClass}" data-id="${postData._id}">
                <div class="postActionContainer">
                    ${pinnedFlag}
                    ${retweetText}
                </div>
                <div class="mainContentContainer">
                    <div class="userImageContainer">
                        <img src="${user.profilePic}">
                    </div>
                    <div class="postContentContainer">
                        <div class="header">
                            <a class="displayName" href="/profile/${user.username}">
                                ${userRealName}
                            </a>
                            <span class="username">@${user.username}</span>
                            <span class="date">${timestamp}</span>
                            ${creatorButtons}
                        </div>
                        ${replyFlag}
                        <div class="postBody">
                            <span>${postContent || postData.retweetData}</span>
                        </div>
                        <div class="postFooter">
                            <div class="postButtonContainer">
                                <button class="replyButton" data-toggle="modal" data-target="#replyModal">
                                    <i class="far fa-comment-alt"></i>
                                </button>
                            </div>
                            <div class="postButtonContainer green">
                                <button class="retweetButton ${retweetButtonActiveClass}">
                                    <i class="fas fa-retweet"></i>
                                    <span>${postData.retweetUsers.length || ""}</span>
                                </button>
                            </div>
                            <div class="postButtonContainer red">
                                <button class="likeButton ${likeButtonActiveClass}">
                                    <i class="far fa-heart"></i>
                                    <span>${postData.likes.length || ""}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                </div>
    </div>`
}

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if (elapsed / 1000 < 30) return "Right now"
        return Math.round(elapsed / 1000) + ' seconds ago';
    }

    else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    }

    else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + ' days ago';
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + ' months ago';
    }

    else {
        return Math.round(elapsed / msPerYear) + ' years ago';
    }
}

function outputPosts(posts, container) {
    container.html("")
    if (!posts) {
        return container.append("<span class='no results'>No Results Found</span>")
    }

    if (!Array.isArray(posts)) {
        posts = [posts]
    }
    posts.forEach(post => {
        let html = createPostHtml(post)
        container.append(html)
    })
}

function outputPostsWithReplies(posts, container) {
    container.html("")

    if (!posts) {
        return container.append("<span class='no results'>No Results Found</span>")
    }

    if (posts.replyTo && posts.replyTo._id) {
        let html = createPostHtml(posts.replyTo)
        container.append(html)
    }

    let mainPostHtml = createPostHtml(posts.postData, true)
    container.append(mainPostHtml)

    posts.replies.forEach(post => {
        let replyHtml = createPostHtml(post)
        container.append(replyHtml)
    })
}

function outputUsers(results, container){
    container.html("");

    if (results.length==0){
        return container.append("No Results found");
    }

    results.forEach(x=>{
        let html = createUserHtml(x,true)
        container.append(html)
    })
}

function createUserHtml(userData, showFollowButton){
    let name = userData.firstName + " " + userData.lastName
    let isFollowing = (userLoggedIn.following && userLoggedIn.following.includes(userData._id))
    let text = isFollowing? "following":"follow";
    let buttonClass = isFollowing? "followButton following":"followButton";
    let followButton = "";
    if(showFollowButton && userLoggedIn._id!=userData._id){
        followButton = `<div class="followButtonContainer">
                            <button class="${buttonClass}" data-user=${userData._id}>
                                ${text}
                            </button>
                        </div>`
    }

    return `<div class="user">
        <div class="userImageContainer">
            <img src=${userData.profilePic}></img>
        </div>
        <div class="userDetailContainer">
            <div class="header">
                <a href="/profile/${userData.username}">
                    ${name}       
                </a>
                <span class="username">@${userData.username}</span>
            </div>
        </div>
        ${followButton}        
    </div>`
}

function searchUsers(searchTerm){
    $.get('/api/users', {search: searchTerm}, (response)=>{
        outputSelectableUsers(response, $(".resultsContainer"))
    })
}

function outputSelectableUsers(results, container){
    container.html("");

    if (results.length==0){
        return container.append("No Results found");
    }

    results.forEach(x=>{

        if (x._id == userLoggedIn._id||selectedUsers.some(users => (users._id == x._id))){
            return
        }

        let html = createUserHtml(x,false)
        let element = $(html)
        element.click(()=>{
            userSelected(x)
        })
        container.append(element)
    })
}

function userSelected(user){
    selectedUsers.push(user);
    updateSelectedUsersHtml()
    $("#userSearchTextBox").val("").focus()
    $(".resultsContainer").html("");
    $("#createChatButton").prop("disabled", false)
}

function updateSelectedUsersHtml(){
    let elements = [];

    selectedUsers.forEach(x=>{
        let name = x.firstName + " " + x.lastName
        let userElement = $(`<span class="selectedUser">${name}</span>`)
        elements.push(userElement)
    })

    $(".selectedUser").remove();
    $("#selectedUsers").prepend(elements)
}

function getChatName(chatData){
    let chatName = chatData.chatName;
    if (!chatName) {
        let users = getOtherChatUsers(chatData.users)
        let namesArray = users.map(user=>{
            return user.firstName + " " + user.lastName
        })
        chatName = namesArray.join(", ")
    }

    return chatName
}

function getOtherChatUsers(users){
    if (users.length == 1) return users;
    let filt = users.filter(x=>x._id!==userLoggedIn._id)
    return filt
}
