let express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const User = require('../schemas/UserSchema')
let bcrypt = require("bcrypt")
const session = require('express-session')



app.set("view engine", "pug")
app.set("views","views")

app.use(bodyParser.urlencoded({ extended: false}))
app.use(session({
    secret: process.env.SessionString,
    resave: true,
    saveUninitialized: false
}))


router.get('/', (req,res,next)=>{//we configured the router to handle requests at root "/" 
    res.status(200).render("login")//to load the login interface
})

router.post('/', async (req,res,next)=>{//we configured the router to handle requests at root "/" 
    let payload = await req.body

    let username = await payload.logUsername.trim()
    let password = payload.logPassword
    if (username && password){
        let user = await User.findOne({username:req.body.logUsername})
        .catch(err=>{
            console.log(err)
            payload.errorMessage = "something went wrong"
            res.status(200).render("login", payload)
        })
        if (user != null){
            let passwordResult = await bcrypt.compare(password, user.password)

            if (passwordResult === true){
                req.session.user = user
                console.log(req.session.user)
                return res.redirect('/')
            }
            payload.errorMessage = "Please re-enter pasword"
            return res.status(200).render("login",payload)     
        }
        payload.errorMessage = "User not found"
        return res.status(200).render("login",payload)
    }
    
    payload.errorMessage = "Confirm each field contains only valid characters",    
    res.status(200).render("login")//to load the login interface
})


module.exports = router