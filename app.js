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

app.use(morgan("dev"))
app.use(bodyParser.urlencoded({ extended: false}))
app.use(express.static(path.join(__dirname,"public")))//this serves all of the contents of our public directory as a static file to our client

app.use(session({
    secret: process.env.SessionString,
    resave: true,
    saveUninitialized: false
}))

//Routes
const loginRoute = require("./routes/loginRoutes")
const registerRoute = require("./routes/registerRoutes")
const logoutRoute = require("./routes/logoutRoutes")

app.use("/login", loginRoute)
app.use("/register", registerRoute)
app.use("/logout", logoutRoute)

//api routes
const postRoute = require("./routes/api/postRoutes")

app.use("/api/posts", postRoute)



app.get('/', middleware.requireLogin, (req,res,next)=>{

    var payLoad = {
        pageTitle: "Home",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user)
    }
    res.status(200).render("home", payLoad)
})

app.listen(process.env.PORT||PORT,()=>{
    console.log(`We are live on port:${PORT}`)
})