// const Post = require("../../schemas/PostSchema")

// const { create } = require("../../schemas/PostSchema")

$(document).ready(()=>{
    $.get("/api/posts", async (response) => {
        outputPosts(response,$(".postsContainer"))
    })
})

function outputPosts(posts, container){
    container.html("")
    if (!posts){
        return container.append("<span class='no results'>No Results Found</span>")
    }
    posts.forEach(post=>{
        let html = createPostHtml(post)
        container.append(html)
    })
}