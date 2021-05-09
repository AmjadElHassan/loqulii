let express = require('express')
const app = express()
const port = 3000
const middleware = require('./middleware')
const path = require('path')

app.set("view engine", "pug")
app.set("views","views")

app.use(express.static(path.join(__dirname,"public")))//this serves all of the contents of our public directory as a static file
//to our client

//Routes
const loginRoute = require("./routes/loginRoutes")

app.use("/login", loginRoute)

app.get('/', middleware.requireLogin, (req,res,next)=>{

    var payLoad = {
        pageTitle: "home"
    }
    res.status(200).render("home", payLoad)
})

app.listen(port,()=>{
    console.log(`We are live on port:${port}`)
})