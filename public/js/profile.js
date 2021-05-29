$(document).ready(async () => {
    await isReply() ?
        loadreplies() :
        loadPosts();
})

async function loadPosts(username) {
    $.get("/api/posts", { postedBy: profileUserId, pinned: true }, async (response) => {
        outputPinnedPosts(response, $(".pinnedContainer"))
    })
        .catch((err) => { console.log(err) })
    $.get("/api/posts", { postedBy: profileUserId, isReply: false }, async (response) => {
        outputPosts(response, $(".postsContainer"))
    })
        .catch((err) => { console.log(err) })

}
async function loadreplies(username) {
    $.get("/api/posts", { postedBy: profileUserId, isReply: true }, async (response) => {
        outputPosts(response, $(".postsContainer"))
    })
        .catch((err) => { console.log(err) })
}

async function isReply() {
    if (selectedTab === "replies") {
        return true
    } else {
        return false
    }

}

function outputPinnedPosts(posts, container) {
    container.html("")
    if (posts.length==0) {
        return container.hide()
    }

    posts.forEach(post => {
        let html = createPostHtml(post)
        container.append(html)
    })
}
