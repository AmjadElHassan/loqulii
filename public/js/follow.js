$(document).ready(async () => {
    console.log(profileUserId)
    await isFollowersTab()?
    loadFollowers():
    loadFollowing();
})

async function isFollowersTab(){
    if (selectedTab === "followers") {
        return true
    } else {
        return false
    }

}

async function loadFollowers(username) {
    $.get(`/api/users/${profileUserId}/followers`, async (response) => {
        outputUsers(response.followers, $(".resultsContainer"))
    })
        .catch((err) => { console.log(err) })
}
async function loadFollowing(username) {
    $.get(`/api/users/${profileUserId}/following`, async (response) => {
        outputUsers(response.following, $(".resultsContainer"))
    })
        .catch((err) => { console.log(err) })
}