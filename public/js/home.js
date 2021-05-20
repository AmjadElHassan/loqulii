// const Post = require("../../schemas/PostSchema")

// const { create } = require("../../schemas/PostSchema")

$(document).ready(()=>{
    $.get("/api/posts", { followingOnly: false}, async (response) => {
        outputPosts(response,$(".postsContainer"))
    })
})
