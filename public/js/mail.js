$(document).ready(()=>{
    $.get("/api/chats", (data,status,xhr)=>{
        if (xhr.status==400){
            alert("could not retrieve chat list")
        } else {
            outputChatList(data, $(".resultsContainer"))
        }
    })
})

function outputChatList(chatList, container){
    
    if (chatList.length==0){
        container.append(`<span style='text-align: center; display: block; margin-top: var(--spacing)'>No Chats Found</span>`)    
    }

    chatList.forEach(chat=>{
        let html = createChatHtml(chat)
        container.append(html)
    })
}

function createChatHtml(chatData){
    let chatName = getChatName(chatData)
    let image = getChatImageElements(chatData)
    let latestMessage = "Dis dat new new"
    return `<a href="/mail/${chatData._id}" class="resultListItem">
    ${image}
    <div class="resultsDetailsContainer ellipsis">
        <span class="heading ellipsis">${chatName}</span>
        <span class="subText ellipsis">${latestMessage}</span>
    </div>
    </a>`
}

function getChatImageElements(chatData){
    let users = getOtherChatUsers(chatData.users)

    let groupChatClass = "";
    let chatImage = getUserChatImageElement(users[0]);
    if (users.length>1){
        groupChatClass = "groupChatImage";
        chatImage += getUserChatImageElement(users[1])
    }
    return `<div class="resultsImageContainer ${groupChatClass}">${chatImage}
    </div>`
}

function getUserChatImageElement(user){
    if (!user||!user.profilePic){
        return alert("user profile pic not valid")
    }

    return `<img src='${user.profilePic}' alt="user profile Pic">`
}