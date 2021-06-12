let connected = false
// module.exports = function(app,server, secret){
//     let clients = {}
// }
let socket = io("http://localhost:3000");

socket.emit("setup", userLoggedIn);

socket.on("connected", ()=>{
    connected = true
    console.log('private user room created')
})

socket.on("message received", (newMessage)=>{
    console.log(newMessage)
    console.log('message was received')

    messageReceived(newMessage)
})