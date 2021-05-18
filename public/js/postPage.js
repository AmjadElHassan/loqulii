
$(document).ready(()=>{
    $.get(`/api/posts/${postId}`, async (response) => {
        outputPostsWithReplies(response,$(".postsContainer"))
    })
})
