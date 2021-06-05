$(document).ready(()=>{
    $.get(`/api/chats/${chatId}`, (data)=>{
        $("#chatName").text(getChatName(data))
    })
    $.get(`/api/chats/${chatId}/messages`, (data)=>{
        let messages = []
        let lastSenderId = ""
        data.forEach((message,index)=>{
            let html = createMessageHtml(message, data[index + 1], lastSenderId)
            messages.push(html)

            lastSenderId = message.sender._id
        })
        let messagesHtml = messages.join('')
        addMessagesHtmlToPage(messagesHtml)
    })
})

$("#submitChatName").click(() => {
    let name = $("#chatNameTextBox").val().trim();

    $.ajax({
        url: `/api/chats/${chatId}`,
        type: "PUT",
        data:{chatName: name},
        success: (data,status,xhr) => {
            if (xhr.status!=204){
                alert('update failed')
            } else {
                location.reload()
            }
        }

    })
})

$(".sendMessageButton").click(()=>{
    messageSubmitted()
})

$(".inputTextBox").keydown((event)=>{
    if(event.which == 13 && !event.shiftKey){
        messageSubmitted()
        return false
    }
})

function messageSubmitted(){
    content = $(".inputTextBox").val().trim()

    if (content!=""){
        sendMessage(content)
        $(".inputTextBox").val("")    
    }
}


function sendMessage(content){
    $.post("/api/messages", {content: content, chatId: chatId}, (data,status,xhr)=>{
        if (xhr.status!=201){
            alert("could not send message")
            $("inputTextBox").val(content)
            return
        }
        $("#chatName").text(getChatName(data.chat))
    
        addChatMessageHtml(data)
    })
}

function addChatMessageHtml(message){
    if(!message||!message._id){
        return alert("invalid message")
    }
    let messageDiv = createMessageHtml(message, null, '')
    addMessagesHtmlToPage(messageDiv)

}

function createMessageHtml(message, nextMessage, lastSenderId){
    console.log(message, nextMessage)
    let sender = message.sender
    let senderName = sender.firstName +' ' + sender.lastName

    let currentSenderId = sender._id
    let nextSenderId = nextMessage!=undefined ? nextMessage.sender._id: ""

    let isFirst = lastSenderId != currentSenderId ? "first":""
    let isLast = nextSenderId != currentSenderId ? "last": ""

    let isMine = message.sender._id == userLoggedIn._id
    let liClassName = isMine ? "mine": "theirs"

    return `
    <li class='message ${liClassName} ${isFirst} ${isLast}'>
        <div class="messageContainer">
        <span class="messageBody">
            ${message.content}
        </span>
        </div>
    
    </li>`
}

function addMessagesHtmlToPage(html){
    $(".chatMessages").append(html)

    //TODO: SCROLL TO BOTTOM
}