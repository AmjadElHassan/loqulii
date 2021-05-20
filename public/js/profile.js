$(document).ready(async () => {
    await isReply()?
    loadreplies():
    loadPosts();
})

async function loadPosts(username) {
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

async function isReply(){
    if (selectedTab === "replies") {
        return true
    } else {
        return false
    }

}