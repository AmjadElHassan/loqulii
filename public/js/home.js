// const Post = require("../../schemas/PostSchema")

// const { create } = require("../../schemas/PostSchema")

$(document).ready(()=>{
    $.get("/api/posts", async (response) => {
        outputPosts(response,$(".postsContainer"))
    })
})
