$(document).ready(()=>{
    $.get(`/api/chats/${chatId}`, (data)=>{
        $("#chatName").text(getChatName(data))
        console.log(data)
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