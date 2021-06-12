let express = require('express')
const app = express()
const PORT = 3000
const middleware = require('./middleware')
const path = require('path')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('./database')
const session = require('express-session')
require('dotenv').config()


app.set("view engine", "pug")
app.set("views","views")


let server = require('http').createServer(app)
app.listen(process.env.PORT||PORT,()=>{
    console.log(`We are live on port:${PORT}`)
})
server.listen(3001,()=>{
    console.log('server thing connected')
})
const io = require("socket.io")(server, {pingTimeout: 60000})


//passive tools
app.use(morgan("dev"))
app.use(bodyParser.urlencoded({ extended: false}))
app.use(express.static(path.join(__dirname,"public")))//this serves all of the contents of our public directory as a static file to our client

app.use(session({
    secret: process.env.SessionString,
    resave: true,
    saveUninitialized: false
}))

io.on("connection", (socket)=>{
    socket.on("setup", userData=>{
        socket.join(userData._id);//creates a user-specific room. this allows us a place to send all user notifications to
        socket.emit("connected");
    })

    socket.on("join room", room=> socket.join(room))
    socket.on("typing", room=> socket.in(room).emit("typing"))
    socket.on("stop typing", room=> socket.in(room).emit("stop typing"))

    socket.on("new message", newMessage=>{
        let chat = newMessage.chat

        if (!chat.users) return "chat.users not defined"

        chat.users.forEach(user=>{
            console.log(user._id)
            if(user._id == newMessage.sender._id) return;
            socket.in(user._id).emit("message received",newMessage)
        })
    })
})


//Routes
const loginRoute = require("./routes/loginRoutes")
const registerRoute = require("./routes/registerRoutes")
const logoutRoute = require("./routes/logoutRoutes")
const postPageRoute = require("./routes/postPageRoutes")
const profileRoute = require("./routes/profileRoutes")
const uploadRoute = require("./routes/uploadRoutes")
const searchRoute = require("./routes/searchRoutes")
const mailRoute = require("./routes/mailRoutes")

app.use("/login", loginRoute)
app.use("/register", registerRoute)
app.use("/post", postPageRoute)
app.use("/logout", logoutRoute)
app.use("/profile", middleware.requireLogin, profileRoute)
app.use("/uploads", uploadRoute)
app.use("/search", middleware.requireLogin, searchRoute)
app.use("/mail", middleware.requireLogin, mailRoute)

//api routes
const postRoute = require("./routes/api/postRoutes")
const usersRoute = require("./routes/api/usersRoutes")
const chatRoute = require("./routes/api/chatRoutes")
const messageRoute = require("./routes/api/messageRoutes")

app.use("/api/posts", postRoute);
app.use("/api/users", usersRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);


app.get('/', middleware.requireLogin, (req,res,next)=>{

    var payLoad = {
        pageTitle: "Home",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user)
    }
    res.status(200).render("home", payLoad)
})

server
