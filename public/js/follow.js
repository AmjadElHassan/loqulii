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