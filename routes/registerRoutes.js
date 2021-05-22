let express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const User = require('../schemas/UserSchema')
let bcrypt = require("bcrypt")


app.set("view engine", "pug")
app.set("views","views")

app.use(bodyParser.urlencoded({ extended: false}))

router.get('/', (req,res,next)=>{//we configured the router to handle requests at root "/" 
    res.status(200).render("register")//to load the login interface
})

router.post('/',async function(req,res,next){//we configured the router to handle requests at root "/" 
    try{
        let firstName = await req.body.firstName.trim()
        let lastName = await req.body.lastName.trim()
        let username = await req.body.username.trim()
        let email = await req.body.email.trim()
        let password = await req.body.password;    

        let payload = await req.body
        console.log(payload)
        
        if (firstName && lastName && username && email && password){
            let existingUser = await User.findOne({
                $or:[
                    {username:username},
                    {email:email}
                ]
            }).catch((err)=>{
                payload.errorMessage = "Please provide only valid characters in each field"
                res.status(200).render("register", payload)    
            })

            if (existingUser==null) {
                payload.password = await bcrypt.hash(password,10)
                let newUser = await User.create(payload)
                console.log(newUser)
                req.session.user = newUser
                console.log(req.session)
                console.log("New User created")
                res.redirect('/')
            }
            else{
                //user found
                if (email==existingUser.email){
                    payload.errorMessage = "Email already In use."
                } else {
                    payload.errorMessage = "Username already In use."
                }
                res.status(200).render("register", payload)                            
            }
        } 

    }
    catch(err){
        console.log(err)
    }
})


module.exports = router