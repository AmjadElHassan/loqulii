// const Post = require("../../schemas/PostSchema")

// const { create } = require("../../schemas/PostSchema")

$(document).ready(()=>{
    $.get("/api/posts", { followingOnly: true}, async (response) => {
        outputPosts(response,$(".postsContainer"))
    })
})
